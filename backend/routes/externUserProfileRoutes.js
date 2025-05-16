const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');
const express = require("express");
const router = express.Router();

router.get('/profile/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {

        const userQuery = 'SELECT user_id, username, email, rank_points, is_admin FROM users WHERE user_id = $1';
        const userResult = await db.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        // Obtener la imagen de perfil si existe
        const imageQuery = 'SELECT image_path FROM profile_image WHERE user_id = $1';
        const imageResult = await db.query(imageQuery, [userId]);

        const userData = userResult.rows[0];
        const profileData = {
            ...userData,
            profileImage: imageResult.rows.length > 0 ? imageResult.rows[0].image_path : null
        };

        res.status(200).send(profileData);
    } catch (err) {
        console.error('Error al obtener el perfil del usuario:', err);
        res.status(500).send({ message: 'Error al cargar el perfil' });
    }
});


router.get('/profile/:userId/solo-history', async (req, res) => {
    const userId = req.params.userId;
    try {
        const query = `
            SELECT 
                game_id, 
                score, 
                TO_CHAR(game_date, 'DD/MM/YYYY HH24:MI') as game_date 
            FROM 
                solo_history 
            WHERE 
                user_id = $1 
            ORDER BY 
                game_date DESC
            LIMIT 10`;
        const result = await db.query(query, [userId]);

        res.status(200).send(result.rows);
    } catch (err) {
        console.error('Error al obtener el historial de juegos en solitario:', err);
        res.status(500).send({ message: 'Error al cargar el historial de juegos' });
    }
});


router.get('/profile/:userId/battle-history', async (req, res) => {
    const userId = req.params.userId;
    try {
        const query = `
            SELECT 
                b.battle_id,
                b.date,
                u1.username as user1_name,
                u2.username as user2_name,
                h.result,
                CASE 
                    WHEN h.winner_user_id = $1 THEN true
                    ELSE false
                END as is_winner
            FROM 
                battle b
            JOIN 
                users u1 ON b.user_id1 = u1.user_id
            JOIN 
                users u2 ON b.user_id2 = u2.user_id
            LEFT JOIN 
                history h ON b.battle_id = h.battle_id
            WHERE 
                b.user_id1 = $1 OR b.user_id2 = $1
            ORDER BY 
                b.date DESC
            LIMIT 10`;
        const result = await db.query(query, [userId]);

        res.status(200).send(result.rows);
    } catch (err) {
        console.error('Error al obtener el historial de batallas:', err);
        res.status(500).send({ message: 'Error al cargar el historial de batallas' });
    }
});

router.get('/profile/:userId/friends', async (req, res) => {
    const userId = req.params.userId;
    try {
        const query = `
            SELECT 
                f.friend_id as user_id, 
                u.username,
                f.state,
                pi.image_path as profile_image
            FROM 
                friends f
            JOIN 
                users u ON f.friend_id = u.user_id
            LEFT JOIN 
                profile_image pi ON f.friend_id = pi.user_id
            WHERE 
                f.user_id = $1 AND f.state = 'accepted'
            UNION
            SELECT 
                f.user_id,
                u.username,
                f.state,
                pi.image_path as profile_image
            FROM 
                friends f
            JOIN 
                users u ON f.user_id = u.user_id
            LEFT JOIN 
                profile_image pi ON f.user_id = pi.user_id
            WHERE 
                f.friend_id = $1 AND f.state = 'accepted'`;
        const result = await db.query(query, [userId]);

        res.status(200).send(result.rows);
    } catch (err) {
        console.error('Error al obtener la lista de amigos:', err);
        res.status(500).send({ message: 'Error al cargar la lista de amigos' });
    }
});

module.exports = router;