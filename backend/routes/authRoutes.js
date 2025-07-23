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

router.post('/create-guest', async (req, res) => {
    try {
        const { user_id, username, password } = req.body;

        // Verificar que el ID no exista
        const existingUser = await db.query('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
        if (existingUser.rows.length > 0) {
            // Si existe, generar nuevo ID
            const newId = Math.floor(Math.random() * 900000) + 100000;
            return res.status(400).json({
                success: false,
                error: 'ID ya existe',
                newId: newId
            });
        }

        // Insertar usuario guest (solo con campos existentes)
        await db.query(
            'INSERT INTO users (user_id, username, password, email) VALUES ($1, $2, $3, NULL)',
            [user_id, username, password]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error creando guest:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Función para limpiar guests antiguos
const cleanOldGuests = async () => {
    try {
        // Eliminar guests creados hace más de 24 horas
        // que no tengan batallas activas
        const cleanupQuery = `
            DELETE FROM users
            WHERE username LIKE 'Guest_%'
            AND user_id NOT IN (
                SELECT DISTINCT user_id1 FROM battle WHERE status = 'ongoing'
                UNION
                SELECT DISTINCT user_id2 FROM battle WHERE status = 'ongoing'
            )
            AND user_id NOT IN (
                SELECT DISTINCT user_id FROM solo_history 
                WHERE game_date > NOW() - INTERVAL '24 hours'
            )
        `;

        const result = await db.query(cleanupQuery);
        console.log(`Usuarios guest limpiados: ${result.rowCount}`);
    } catch (error) {
        console.error('Error limpiando usuarios guest:', error);
    }
};

// borra guests cada 10 mins
setInterval(cleanOldGuests,   10 *  60 * 1000);



module.exports = router;
