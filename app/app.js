const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

const db = require('./database');
const {response} = require("express");

// middleware para usar formularios
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <h1>Registro de Usuario</h1>
        <form action="/register" method="POST">
            <label>Nombre:</label>
            <input type="text" name="username" required />
            <label>Contraseña:</label>
            <input type="password" name="password" required />
            <label>Email:</label>
            <input type="text" name="email" required />
            <button type="submit">Register</button>
        </form>
    `);
});

app.post('/register', async (req, res) => {
    const {username, password, email} = req.body; // defino las variables del body

    if (!username || !password) {
        return res.send('Por favor, completá todos los campos.'); // si falta alguno tire msg
    }

        try {
            const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *';
            const result = await db.query(query, [username, password, email]);
            res.send(`
        <h3>Usuario registrado con éxito.</h3> 
        <a href="/">Volver</a>
        <h3>${JSON.stringify(result.rows)}</h3>
        <form action="/register" method="POST">
    `);
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).send('Error en el servidor');// 500 = error de servidor
        }

});

app.post('/admin', async (res, req)=>{


    } );
