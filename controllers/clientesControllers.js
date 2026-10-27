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

const buscarCliente = async (req, res) => {
    const { nombre } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM viandas.Clientes WHERE nombre = ?', [nombre]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        const cliente = rows[0];

        return res.json({
            mensaje: 'Cliente encontrado',
            cliente: { nombre: cliente.nombre, telefono: cliente.telefono, direccion: cliente.direccion }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'error interno del servidor' });
    }
};

module.exports = { agregarCliente, buscarCliente };