const db = require('../config/database');

const agregarCliente = async (req, res) => {
    const { nombre, telefono, direccion } = req.body;

    try {
        const [resultado] = await db.query ('INSERT INTO viandas.Clientes (nombre, telefono, direccion) VALUES (?, ?, ?)', [nombre, telefono, direccion]);

        return res.status(201).json({
            mensaje: 'Cliente agregado exitosamente'
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'error interno del servidor' });
    }
};

const obtenerClientes = async (req, res) => {

    try {
        const [rows] = await db.query('SELECT id, nombre, telefono, direccion FROM viandas.Clientes');

        if (!rows || rows.length === 0) {
            return res.status(404).json({ mensaje: 'no se encontraron clientes' });
        }

        return res.status(200).json(rows);

    } catch(error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'error interno del servidor' });
    }
}

const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query('DELETE FROM viandas.Clientes WHERE id = ?', [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        return res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}

const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion } = req.body;

    try {
        const [resultado] = await db.query('UPDATE viandas.Clientes SET nombre = ?, telefono = ?, direccion = ? WHERE id = ?', [nombre, telefono, direccion, id]);

        if (resultado.affectedRows === 0) {
            const [clientes] = await db.query('SELECT id FROM viandas.Clientes WHERE id = ?', [id]);

            if (clientes.length === 0) {
                return res.status(404).json({ mensaje: 'Cliente no encontrado' });
            }
        }

        return res.status(200).json({ mensaje: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje:'error interno del servidor' });
    }
}

module.exports = { agregarCliente, obtenerClientes, eliminarCliente, actualizarCliente};