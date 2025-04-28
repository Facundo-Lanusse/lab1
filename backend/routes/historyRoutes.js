const express = require('express');
const router = express.Router();
const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');

router.post('/SetSoloHistory', async (req, res) => {
    const {score, userId } = req.body;

    try {
        const soloHistoryQuery = 'INSERT INTO solo_history (user_id, score, game_date) VALUES ($1, $2, date_trunc(\'minute\', now()))';
        await db.query(soloHistoryQuery, [userId, score]);
        res.json({message: 'Successfully inserted solo history'});
    }
    catch (error) {
        console.error('No se pudo crear el historial de esta partida', error);
        res.status(400).send({error: error.message});
    }
})

router.get('/FetchSoloHistory', async (req, res) => {
    const { userId } = req.query;
    try {
        const soloHistoryQuery = 'select score, game_date from solo_history where user_id = $1 order by game_date desc limit 10';
        const result = await db.query(soloHistoryQuery, [userId]);
        res.json(result.rows);
    }
    catch (error) {
        console.log('No se pudo cargar el historial', error);
        res.status(400).send({error: error.message});
    }
})


module.exports = router;