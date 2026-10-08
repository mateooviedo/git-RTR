require("dotenv").config();

const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        //ejecutar consulta simple para coneccion
        await db.query('SELECT 1');
        console.log('conexion a la base de datos establecida correctamente.');

        app.listen(PORT, () => {
            console.log('servidor ejecutandose en el puerto ' + PORT);
        });
    } catch (error) {
        console.error('error al conectar la base de datos: ', error);
    }
}

startServer();