const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

const client = require('./database');
const {response} = require("express");


app.get('/',async (req, res) => {
    try {

        const result = await client.query('SELECT * FROM users');

        res.send(result.rows);

    } catch (err) {
        console.error('Falló la consulta', err);
    }

});


