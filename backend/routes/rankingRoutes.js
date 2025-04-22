const express = require('express');
const router = express.Router();
const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');

router.get('/fetchUsersForRanking', async (req, res) => {
    try {
        const query = 'SELECT user_id, username, rank_points FROM users order by rank_points';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        res.status(500).json({ error: 'Fallo la consulta' });
    }
})


module.exports = router;