const { Client } = require('pg');

const database = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'mateo2020',
    port: 5432,
});

database.connect()
    .then(() => console.log('Conectado a la base')) //Manda a la consola si me conecte
    .catch(err => console.error('Error de conexión, no se pudo conectar', err)); //Atrapa el error si no se conecta

//UsersStructure = (id, username, password, email, rank_points)-> id y rank_points se setan automaticamente

module.exports = database;
