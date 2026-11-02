const db = require('../config/database');

const esIdMenuValido = (id) => /^[1-9]\d*$/.test(String(id));

// Obtener todo el menú
const obtenerMenu = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Menu');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener el menú' });
    }
};

// Agregar plato (con imagen)
const agregarPlato = async (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    const imagenRuta = req.file ? `uploads/${req.file.filename}` : null;

    try {
        // Por defecto activo = 0 (desactivado) como mencionaste que se crean de inicio
        const query = 'INSERT INTO Menu (nombre, descripcion, precio, imagen, activo) VALUES (?, ?, ?, ?, 0)';
        const [result] = await db.query(query, [nombre, descripcion, precio, imagenRuta]);

        res.status(201).json({ mensaje: 'Plato guardado exitosamente', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al guardar el plato' });
    }
};

// Actualizar plato
const actualizarPlato = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;

    if (!esIdMenuValido(id)) {
        return res.status(400).json({ mensaje: 'Identificador de plato inválido' });
    }

    try {
        let query;
        let params;

        // Si subió una nueva imagen, actualizamos también la ruta
        if (req.file) {
            const imagenRuta = `uploads/${req.file.filename}`;
            query = 'UPDATE Menu SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE idMenu = ?';
            params = [nombre, descripcion, precio, imagenRuta, id];
        } else {
            // Si no subió imagen nueva, dejamos la que ya tenía
            query = 'UPDATE Menu SET nombre = ?, descripcion = ?, precio = ? WHERE idMenu = ?';
            params = [nombre, descripcion, precio, id];
        }

        await db.query(query, params);
        res.json({ mensaje: 'Plato actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el plato' });
    }
};

// Cambiar estado (Checkbox disponible)
const actualizarEstado = async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;

    if (!esIdMenuValido(id)) {
        return res.status(400).json({ mensaje: 'Identificador de plato inválido' });
    }

    try {
        await db.query('UPDATE Menu SET activo = ? WHERE idMenu = ?', [activo, id]);
        res.json({ mensaje: 'Estado actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado' });
    }
};

// Eliminar plato
const eliminarPlato = async (req, res) => {
    const { id } = req.params;

    if (!esIdMenuValido(id)) {
        return res.status(400).json({ mensaje: 'Identificador de plato inválido' });
    }

    try {
        await db.query('DELETE FROM Menu WHERE idMenu = ?', [id]);
        res.json({ mensaje: 'Plato eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar el plato' });
    }
};

module.exports = { obtenerMenu, agregarPlato, actualizarPlato, actualizarEstado, eliminarPlato };