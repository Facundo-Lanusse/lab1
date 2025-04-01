require('dotenv').config();

console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('Password:', process.env.DB_PASSWORD);

const { Client } = require('pg');

const database = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

database.connect()
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error de conexión, no se pudo conectar', err));

module.exports = database;