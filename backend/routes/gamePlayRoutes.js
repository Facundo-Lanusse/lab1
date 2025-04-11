const express = require('express');
const router = express.Router();
const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');


router.get('/PlayQuestions', async(req, res) =>{

    try{
        const randomQuestionQuery = 'SELECT * FROM question where alreadypicked = false ORDER BY RANDOM() LIMIT 1';
        const queryQuestionResult = await db.query(randomQuestionQuery)

        if(queryQuestionResult.rows[0] < 1 ) {
            return res.status(404).json({ error: 'Fallo la consulta de pregunta' });}

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

router.post('/CheckQuestion', async (req, res) =>{
    const {questionId} = req.body;
    try{
        const updateQuestionQuery = 'Update question set alreadypicked = true where question_id = $1'
        await db.query(updateQuestionQuery, [questionId])
        res.json({message: 'Se actualizó la pregunta correctamente', id: questionId})
    }
    catch (error){
        console.log('Falla el update de la pregunta', error)
        res.status(500)
    }

});

router.post('/UncheckQuestion', async (req, res) =>{

    try {
        const updateQuestionQuery = 'Update question set alreadypicked = false'
        await db.query(updateQuestionQuery)
        res.json({message: 'Se actualizó la pregunta correctamente'})

    }
    catch (error){
        console.log('Fallo el update de la pregunta', error)
    }


})



module.exports = router;