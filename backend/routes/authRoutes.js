const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM USERS WHERE email = $1 AND password = $2';
        const userQuery = await db.query(query, [email, password]);

        if (userQuery.rows.length > 0) {
            const user = userQuery.rows[0];
            const token = jwt.sign({ id: user.user_id, username: user.username }, process.env.SECRET_JWT_KEY, {
                expiresIn: '1h'
            });

            return res.json({
                message: 'Logueado correctamente',
                user: {
                    id: user.user_id,
                    email: user.email,
                    username: user.username,
                    is_admin: user.is_admin
                },
                token
            });
        } else {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    } catch (err) {
        console.error('Error al loguear:', err);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

router.post('/register', async (req, res) => {
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

module.exports = router;
