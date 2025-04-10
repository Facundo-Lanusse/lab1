const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/uploadQuestion', async (req, res) => {
    const { categoryName, questionText } = req.body;

    if (!categoryName || !questionText) {
        return res.status(400).json({ error: 'Por favor, completá todos los campos.' });
    }

    try {
        const queryForCategory = 'SELECT * FROM category WHERE name = $1';
        const resultForCategory = await db.query(queryForCategory, [categoryName]);

        if (resultForCategory.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const categoryId = resultForCategory.rows[0].category_id;
        const queryForQuestion = 'INSERT INTO question(questionText, category_id) VALUES ($1, $2) RETURNING *';
        const result = await db.query(queryForQuestion, [questionText, categoryId]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al cargar pregunta:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/uploadAnswers', async (req, res) => {
    const {answerCorrect, answerFalse1, answerFalse2, answerFalse3, questionText} = req.body;

    if (!answerCorrect || !answerFalse1 || !answerFalse2 || !answerFalse3) {
        return res.status(400).json({ error: 'Por favor, completá todos los campos' });
    }

    try {

        const queryForQuestion = 'SELECT * FROM question WHERE questiontext = $1';
        const resultForQuestion = await db.query(queryForQuestion, [questionText]);

        if (resultForQuestion.rows.length === 0) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        const questionId = resultForQuestion.rows[0].question_id;

        const queryForAnswerCorrect = 'INSERT INTO answer(question_id, text, is_correct) VALUES ($1, $2, true) RETURNING *';
        const queryForAnswerFalse1 = 'INSERT INTO answer(question_id, text) VALUES ($1, $2) RETURNING *';
        const queryForAnswerFalse2 = 'INSERT INTO answer(question_id, text) VALUES ($1, $2) RETURNING *';
        const queryForAnswerFalse3 = 'INSERT INTO answer(question_id, text) VALUES ($1, $2) RETURNING *';

        const resultForAnswerCorrect = await db.query(queryForAnswerCorrect, [questionId, answerCorrect]);//paso por una lado la consulta y en el otro los valores que se necesitan para esta
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
