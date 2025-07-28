const express = require('express');
const router = express.Router();
const db = require('../database');

// Ruta con paginado para categorías de comunidad
router.get('/FetchCommunityCategoriesApproved', async (req, res) => {
    try {
        // Parámetros de paginado con valores por defecto
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8; // 8 categorías por página para las tarjetas
        const search = req.query.search || '';

        // Calcular offset
        const offset = (page - 1) * limit;

        // Query base
        let baseQuery = 'FROM community_category WHERE publish_state = $1';
        let whereClause = '';
        let queryParams = ['accepted'];

        // Agregar filtro de búsqueda si existe
        if (search.trim()) {
            whereClause = ' AND name ILIKE $2';
            queryParams.push(`%${search}%`);
        }

        // Query para contar total de registros
        const countQuery = `SELECT COUNT(*) as total ${baseQuery}${whereClause}`;
        const countResult = await db.query(countQuery, queryParams);
        const totalCategories = parseInt(countResult.rows[0].total);

        // Query para obtener las categorías paginadas
        const categoriesQuery = `
            SELECT name, community_category_id 
            ${baseQuery}${whereClause}
            ORDER BY name ASC
            LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
        `;

        queryParams.push(limit, offset);
        const categoriesResult = await db.query(categoriesQuery, queryParams);

        // Calcular información de paginado
        const totalPages = Math.ceil(totalCategories / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            categories: categoriesResult.rows,
            pagination: {
                currentPage: page,
                totalPages,
                totalCategories,
                limit,
                hasNextPage,
                hasPrevPage
            }
        });
    } catch (err) {
        console.error("Al traer categorias", err);
        res.status(500).json({ error: 'Fallo la consulta' });
    }
});

router.post('/CreateCommunityCategory', async (req, res) => {
    const {name, userId, gameMode} = req.body;
    try {
        const createCategoryQuery = 'insert into community_category(name, user_id, game_mode) values($1, $2, $3) ';
        await db.query(createCategoryQuery, [name, userId, gameMode]);
        res.json({ success: `Categoria de comunidad creada con nombre ${name} y modo de juego ${gameMode}}`} );
    }
    catch (err) {
        console.error("Error al crear categoria", err);
        res.status(500).json({ error: 'Error al crear categoria' });
    }
});

router.post('/uploadCommunityQuestion', async (req, res) => {
    const { categoryName, questionText } = req.body;

    if (!categoryName || !questionText) {
        return res.status(400).json({ error: 'Por favor, completá todos los campos.' });
    }

    try {
        const queryForCategory = 'SELECT * FROM community_category WHERE name = $1';
        const resultForCategory = await db.query(queryForCategory, [categoryName]);

        if (resultForCategory.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const categoryId = resultForCategory.rows[0].community_category_id;
        const queryForQuestion = 'INSERT INTO community_question(question_text, community_category_id) VALUES ($1, $2) RETURNING *';
        const result = await db.query(queryForQuestion, [questionText, categoryId]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al cargar pregunta:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/uploadCommunityAnswers', async (req, res) => {
    const {answerCorrect, answerFalse1, answerFalse2, answerFalse3, questionText} = req.body;

    if (!answerCorrect || !answerFalse1 || !answerFalse2 || !answerFalse3) {
        return res.status(400).json({ error: 'Por favor, completá todos los campos' });
    }

    try {
        const queryForQuestion = 'SELECT * FROM community_question WHERE question_text = $1';
        const resultForQuestion = await db.query(queryForQuestion, [questionText]);

        if (resultForQuestion.rows.length === 0) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        const questionId = resultForQuestion.rows[0].community_question_id;

        const queryForAnswerCorrect = 'INSERT INTO community_answer(community_question_id, answer_text, is_correct) VALUES ($1, $2, true) RETURNING *';
        const queryForAnswerFalse1 = 'INSERT INTO community_answer(community_question_id, answer_text) VALUES ($1, $2) RETURNING *';
        const queryForAnswerFalse2 = 'INSERT INTO community_answer(community_question_id, answer_text) VALUES ($1, $2) RETURNING *';
        const queryForAnswerFalse3 = 'INSERT INTO community_answer(community_question_id, answer_text) VALUES ($1, $2) RETURNING *';

        const resultForAnswerCorrect = await db.query(queryForAnswerCorrect, [questionId, answerCorrect]);
        const resultForAnswerFalse1 = await db.query(queryForAnswerFalse1, [questionId, answerFalse1]);
        const resultForAnswerFalse2 = await db.query(queryForAnswerFalse2, [questionId, answerFalse2]);
        const resultForAnswerFalse3 = await db.query(queryForAnswerFalse3, [questionId, answerFalse3]);

        res.json({
                answerCorrect: resultForAnswerCorrect.rows[0],
                answerFalse1: resultForAnswerFalse1.rows[0],
                answerFalse2: resultForAnswerFalse2.rows[0],
                answerFalse3: resultForAnswerFalse3.rows[0]
            }
        );

    } catch (error) {
        console.error('Error al cargar pregunta:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.get('/FetchCommunityCategories', async (req, res) => {
    try {
        const query = 'SELECT * FROM community_category';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error al traer categorias pendientes", err);
        res.status(500).json({ error: 'Fallo la consulta' });
    }
});

module.exports = router;