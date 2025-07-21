const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM USERS WHERE email = $1 AND password = $2';
        const userQuery = await db.query(query, [email, password]);

        if (userQuery.rows.length > 0) {
            const user = userQuery.rows[0];
            const token = jwt.sign({ user_id: user.user_id}, process.env.SECRET_JWT_KEY, {
                expiresIn: '1h'
            });

            return res.json({
                message: 'Logueado correctamente',
                user: {
                    user_id: user.user_id,
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

router.post('/google-auth', async (req, res) => {
    const { token } = req.body;
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name || payload.given_name || 'GoogleUser';
        // Buscar usuario por email
        const query = 'SELECT * FROM users WHERE email = $1';
        const userQuery = await db.query(query, [email]);
        if (userQuery.rows.length > 0) {
            const user = userQuery.rows[0];
            const jwtToken = jwt.sign({ user_id: user.user_id }, process.env.SECRET_JWT_KEY, {
                expiresIn: '1h'
            });
            return res.json({
                message: 'Usuario logueado correctamente',
                user: {
                    user_id: user.user_id,
                    email: user.email,
                    username: user.username,
                    is_admin: user.is_admin
                },
                token: jwtToken
            });
        } else {

            const newUserQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
            const newUserResult = await db.query(newUserQuery, [name, email, 'google_oauth']);
            const newUser = newUserResult.rows[0];
            const jwtToken = jwt.sign({ user_id: newUser.user_id }, process.env.SECRET_JWT_KEY, {
                expiresIn: '1h'
            });
            return res.json({
                message: 'Usuario registrado y logueado correctamente',
                user: {
                    user_id: newUser.user_id,
                    email: newUser.email,
                    username: newUser.username,
                    is_admin: newUser.is_admin
                },
                token: jwtToken
            });
        }
    } catch (error) {
        console.error('Error en la autenticación de Google:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

module.exports = router;
