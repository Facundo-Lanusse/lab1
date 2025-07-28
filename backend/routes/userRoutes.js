const express = require('express');
const router = express.Router();
const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');

// Ruta con paginado
router.get('/users', validateUser, async (req, res) => {
    try {
        // Parámetros de paginado con valores por defecto
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const sortDirection = req.query.sort === 'asc' ? 'ASC' : 'DESC';

        // Calcular offset
        const offset = (page - 1) * limit;

        // Query base
        let baseQuery = 'FROM users';
        let whereClause = '';
        let queryParams = [];

        // Agregar filtro de búsqueda si existe
        if (search.trim()) {
            whereClause = ' WHERE username ILIKE $1';
            queryParams.push(`%${search}%`);
        }

        // Query para contar total de registros
        const countQuery = `SELECT COUNT(*) as total ${baseQuery}${whereClause}`;
        const countResult = await db.query(countQuery, queryParams);
        const totalUsers = parseInt(countResult.rows[0].total);

        // Query para obtener los usuarios paginados
        const usersQuery = `
            SELECT user_id, username, rank_points, email 
            ${baseQuery}${whereClause}
            ORDER BY rank_points ${sortDirection}
            LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
        `;

        queryParams.push(limit, offset);
        const usersResult = await db.query(usersQuery, queryParams);

        // Calcular información de paginado
        const totalPages = Math.ceil(totalUsers / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            users: usersResult.rows,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                limit,
                hasNextPage,
                hasPrevPage
            }
        });
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

router.delete('/users/:id', validateUser, async (req, res) => {
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