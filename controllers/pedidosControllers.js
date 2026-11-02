const db = require('../config/database');

// Obtener pedidos agrupados con sus comidas y cantidades
const obtenerPedidos = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.idPedido,
                c.nombre AS cliente,
                GROUP_CONCAT(CONCAT(m.nombre, ' (x', dp.cantidad, ')') ORDER BY m.nombre SEPARATOR ', ') AS plato,
                SUM(dp.cantidad) AS cantidad,
                p.total,
                p.fechaPedido
            FROM viandas.Pedidos p
            INNER JOIN viandas.Clientes c ON p.idCliente = c.id
            INNER JOIN viandas.Historial dp ON p.idPedido = dp.idPedido
            INNER JOIN viandas.Menu m ON dp.idMenu = m.idMenu
            GROUP BY p.idPedido, c.nombre, p.total, p.fechaPedido
            ORDER BY p.fechaPedido DESC
        `;

        const [rows] = await db.query(query);

        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Agregar un nuevo pedido (inserta en 'pedidos' y en 'detalle_pedido')
const agregarPedido = async (req, res) => {
    const { id_cliente, items, total } = req.body;

    if (!id_cliente || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ mensaje: 'Datos del pedido incompletos' });
    }

    const itemsValidados = items.map((item) => ({
        idMenu: Number(item?.id_plato),
        cantidad: Number(item?.cantidad),
        precioUnitario: Number(item?.precio_unitario)
    }));

    if (
        !Number.isFinite(Number(total)) ||
        itemsValidados.some(({ idMenu, cantidad, precioUnitario }) =>
            !Number.isInteger(idMenu) ||
            idMenu <= 0 ||
            !Number.isInteger(cantidad) ||
            cantidad <= 0 ||
            !Number.isFinite(precioUnitario) ||
            precioUnitario < 0
        )
    ) {
        return res.status(400).json({ mensaje: 'Los datos de los productos del pedido son inválidos' });
    }

    // Obtenemos una conexión individual para manejar la transacción
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Insertar la cabecera del pedido
        const queryPedido = 'INSERT INTO viandas.Pedidos (idCliente, fechaPedido, total) VALUES (?, CURRENT_TIMESTAMP, ?)';
        const [resultadoPedido] = await connection.query(queryPedido, [id_cliente, total]);
        const id_pedido = resultadoPedido.insertId;

        // 2. Insertar cada plato seleccionado en el detalle
        const queryDetalle = `
            INSERT INTO viandas.Historial (idPedido, idMenu, cantidad, precioUnitario, subtotal)
            VALUES (?, ?, ?, ?, ?)
        `;

        for (const item of itemsValidados) {
            const subtotal = item.cantidad * item.precioUnitario;
            await connection.query(queryDetalle, [
                id_pedido,
                item.idMenu,
                item.cantidad,
                item.precioUnitario,
                subtotal
            ]);
        }

        await connection.commit();

        return res.status(201).json({
            mensaje: 'Pedido agregado exitosamente',
            id_pedido
        });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al procesar el pedido' });
    } finally {
        connection.release();
    }
};

// Eliminar pedido y su detalle
const eliminarPedido = async (req, res) => {
    const { id } = req.params;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Eliminar detalles primero por integridad referencial
        await connection.query('DELETE FROM viandas.Historial WHERE idPedido = ?', [id]);
        
        // Eliminar pedido principal
        const [resultado] = await connection.query('DELETE FROM viandas.Pedidos WHERE idPedido = ?', [id]);

        if (resultado.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        await connection.commit();
        return res.status(200).json({ mensaje: 'Pedido eliminado correctamente' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    } finally {
        connection.release();
    }
};

module.exports = {
    obtenerPedidos,
    agregarPedido,
    eliminarPedido
};