const express = require('express');
const router = express.Router();
const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');

router.get('/users', async (req, res) => {
    try {
        const query = 'SELECT user_id, username, rank_points, email FROM users order by rank_points desc';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        res.status(500).json({ error: 'Fallo la consulta' });
    }
});

router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT user_id, username, rank_points, email FROM users WHERE user_id = $1';
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM users WHERE user_id = $1 RETURNING *';
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

module.exports = router;
