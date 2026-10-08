require("dotenv").config();
const mysql = require('mysql2');

const configDB = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const db = mysql.createPool(configDB);

module.exports = db.promise();