const db = require('../config/database');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM viandas.Login WHERE email = ?', [email]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ mensaje: 'usuario no encontrado' });
        }

        const usuario = rows[0];

        // Aquí idealmente se debe usar bcrypt.compare; asumo contraseña en texto plano por ahora
        if (usuario.password !== password) {
            return res.status(401).json({ mensaje: 'contraseña incorrecta' });
        }

        return res.json({
            mensaje: 'inicio exitoso',
            usuario: { email: usuario.email }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'error interno del servidor' });
    }
};

const test = async (req, res) => {
    try {
        const [filas] = await db.query('SELECT * FROM viandas.Login LIMIT 1');
        console.log(filas);
        return res.json({ filas });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ mensaje: 'error' });
    }
};

module.exports = { login, test };