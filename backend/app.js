// index.js (Express API REST adaptado para React)
const express = require('express');
const app = express();
const db = require('./database');
const cors = require('cors'); // Para conectar con React

app.use(express.json());
app.use(cors()); // Permite conexiones del frontend React

// Registro de usuarios
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Completá todos los campos.' });
    }

    try {
        const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *';
        const result = await db.query(query, [username, password, email]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Listado de usuarios
app.get('/api/users', async (req, res) => {
    try {
        const query = 'SELECT username, email FROM users';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
