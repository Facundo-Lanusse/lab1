const express = require('express');
const router = express.Router();
const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');


router.get('/PlayQuestions', async(req, res) =>{

    try{
        const randomQuestionQuery = 'SELECT * FROM question where alreadypicked = false ORDER BY RANDOM() LIMIT 1';
        const queryQuestionResult = await db.query(randomQuestionQuery)

        const questionId = queryQuestionResult.rows[0].question_id;

        const queryForAnswers = 'SELECT * FROM answer where question_id = $1'
        const queryAnswerResult = await db.query(queryForAnswers,[questionId])

        res.json({
            question: queryQuestionResult.rows[0],
            answers: queryAnswerResult.rows}
        );
    }
    catch (error){
        console.error('Error al cargar:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/CheckAnswer', async (req, res) =>{



});



module.exports = router;