const express = require('express');
const router = express.Router();
const db = require('../database');

// Crear una nueva partida bullet online
router.post('/bullet-online/start', async (req, res) => {
    const { userId, opponentId } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO bullet_online_battle (user_id1, user_id2, current_turn) VALUES ($1, $2, $1) RETURNING *`,
            [userId, opponentId]
        );
        res.status(201).json({ success: true, battle: result.rows[0] });
    } catch (error) {
        console.error('Error al crear partida bullet online:', error);
        res.status(500).json({ success: false, message: 'Error al crear la partida' });
    }
});

// Obtener estado de la partida
router.get('/bullet-online/:battleId/state', async (req, res) => {
    const { battleId } = req.params;
    try {
        const result = await db.query(
            `SELECT * FROM bullet_online_battle WHERE battle_id = $1`,
            [battleId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Partida no encontrada' });
        }
        res.json({ success: true, battle: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el estado' });
    }
});

// Guardar score y pasar turno
router.post('/bullet-online/:battleId/score', async (req, res) => {
    const { battleId } = req.params;
    const { userId, score } = req.body;
    const io = req.app.get('io');
    try {
        // Obtener partida
        const result = await db.query(`SELECT * FROM bullet_online_battle WHERE battle_id = $1`, [battleId]);
        if (result.rows.length === 0) return res.status(404).json({ success: false });
        const battle = result.rows[0];
        let updated;
        if (userId === battle.user_id1) {
            // Primer jugador termina
            updated = await db.query(
                `UPDATE bullet_online_battle SET score1 = $1, current_turn = $2 WHERE battle_id = $3 RETURNING *`,
                [score, battle.user_id2, battleId]
            );
        } else if (userId === battle.user_id2) {
            // Segundo jugador termina, decidir ganador
            let winnerId = null;
            if (score > battle.score1) winnerId = userId;
            else if (score < battle.score1) winnerId = battle.user_id1;
            // Si empate, winnerId queda null
            updated = await db.query(
                `UPDATE bullet_online_battle SET score2 = $1, status = 'completed', winner_id = $2 WHERE battle_id = $3 RETURNING *`,
                [score, winnerId, battleId]
            );
        } else {
            return res.status(400).json({ success: false, message: 'Usuario no pertenece a la partida' });
        }
        // Uncheck all bullet questions cuando termina el turno de cualquier jugador
        await db.query('UPDATE bullet_questions SET already_picked = false');
        // Emitir evento de actualización
        io.to(`bullet_online_${battleId}`).emit('bulletOnlineUpdated', { battleId });
        res.json({ success: true, battle: updated.rows[0] });
    } catch (error) {
        console.error('Error en bullet-online/score:', error);
        res.status(500).json({ success: false, message: 'Error al guardar score', details: error.message });
    }
});

// Unirse a la sala de la partida (WebSocket)
router.post('/bullet-online/:battleId/join', (req, res) => {
    const io = req.app.get('io');
    const { battleId } = req.params;
    const { socketId } = req.body;
    if (io && socketId && battleId) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
            socket.join(`bullet_online_${battleId}`);
            return res.json({ success: true });
        }
    }
    res.status(400).json({ success: false, message: 'No se pudo unir a la sala' });
});

// Obtener las bullet battles de un usuario
router.get('/bullet-online/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query(
            `SELECT bob.*, 
                CASE WHEN bob.user_id1 = $1 THEN u2.username ELSE u1.username END as opponent_name
             FROM bullet_online_battle bob
             JOIN users u1 ON bob.user_id1 = u1.user_id
             JOIN users u2 ON bob.user_id2 = u2.user_id
             WHERE bob.user_id1 = $1 OR bob.user_id2 = $1 
             ORDER BY bob.created_at DESC`,
            [userId]
        );
        res.json({ success: true, battles: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las partidas bullet online' });
    }
});

module.exports = router;
