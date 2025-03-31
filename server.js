const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(cors()); // Permite que el frontend acceda al backend
app.use(bodyParser.json());

app.listen(3007, () => {
    console.log('Servidor corriendo en http://localhost:3000/api/register');
});

// Registrar usuario
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Por favor, completá todos los campos.' });
    }

    try {
        const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *';
        const result = await db.query(query, [username, password, email]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener lista de usuarios
app.get('/api/users', async (req, res) => {
    try {
        const query = 'SELECT id, username, email FROM users';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        res.status(500).json({ error: 'Fallo la consulta' });
    }
});

// Eliminar usuario
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
