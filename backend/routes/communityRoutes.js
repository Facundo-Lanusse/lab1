const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/FetchCommunityCategoriesApproved', async (req, res) => {
    try{
        const categoriesQuery = 'Select name, community_category_id from community_category where publish_state = $1';
        const categoryQueryResult = await db.query(categoriesQuery,['accepted']);
        res.json(categoryQueryResult.rows);

    }
    catch(err){
        console.error("Al traer categorias", err);
        res.status(500).json({ error: 'Fallo la consulta' });
    }
});


router.post('/CreateCommunityCategory', async (req, res) => {
    const {name, userId} = req.body;
    try {

        const createCategoryQuery = 'insert into community_category(name, user_id) values($1, $2) ';
        await db.query(createCategoryQuery, [name, userId]);
        res.json({ success: 'Categoria de comunidad creada exitosamente'});
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



module.exports = router;