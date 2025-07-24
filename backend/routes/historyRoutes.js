const express = require('express');
const router = express.Router();
const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');

router.post('/SetSoloHistory', async (req, res) => {
    const {score, userId } = req.body;

    console.log('SetSoloHistory called with:', { score, userId });

    try {
        const soloHistoryQuery = 'INSERT INTO solo_history (user_id, score, game_date) VALUES ($1, $2, date_trunc(\'minute\', now()))';
        const result = await db.query(soloHistoryQuery, [userId, score]);
        console.log('Solo history inserted successfully:', result.rowCount);
        res.json({message: 'Successfully inserted solo history'});
    }
    catch (error) {
        console.error('No se pudo crear el historial de esta partida', error);
        res.status(400).send({error: error.message});
    }
})

router.get('/FetchSoloHistory', async (req, res) => {
    const { userId, page = 1, limit = 5 } = req.query;
    console.log('FetchSoloHistory called with:', { userId, page, limit });

    try {
        const offset = (page - 1) * limit;

        // Obtener el total de registros para calcular el número total de páginas
        const countQuery = 'SELECT COUNT(*) FROM solo_history WHERE user_id = $1';
        const countResult = await db.query(countQuery, [userId]);
        const totalRecords = parseInt(countResult.rows[0].count);
        console.log('Total records found:', totalRecords);

        const totalPages = Math.ceil(totalRecords / limit);

        // Obtener los registros paginados
        const soloHistoryQuery = 'SELECT score, game_date FROM solo_history WHERE user_id = $1 ORDER BY game_date DESC LIMIT $2 OFFSET $3';
        const result = await db.query(soloHistoryQuery, [userId, limit, offset]);
        console.log('Games found:', result.rows.length);

        res.json({
            games: result.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalRecords,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    }
    catch (error) {
        console.log('No se pudo cargar el historial', error);
        res.status(400).send({error: error.message});
    }
})


module.exports = router;