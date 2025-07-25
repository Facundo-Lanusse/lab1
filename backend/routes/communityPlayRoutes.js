const express = require('express');
const router = express.Router();
const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');


router.get('/PlayCommunityQuestions/:categoryId', async(req, res) =>{
    try{
        const categoryId = req.params.categoryId;

        const categoryQuery = 'SELECT game_mode FROM community_category WHERE community_category_id = $1';
        const categoryResult = await db.query(categoryQuery, [categoryId]);

        if(!categoryResult.rows[0]) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const gameMode = categoryResult.rows[0].game_mode;

        const randomQuestionQuery = 'SELECT * FROM community_question where alreadypicked = $1 and community_category_id = $2 ORDER BY RANDOM() LIMIT 1';
        const queryQuestionResult = await db.query(randomQuestionQuery, [false ,categoryId])

        if(!queryQuestionResult.rows[0]) {
            res.json({allQuestionChecked: true, message: 'Pasa el if'})
        }
        else{
            const questionId = queryQuestionResult.rows[0].community_question_id;

            const queryForAnswers = 'SELECT * FROM community_answer where community_question_id = $1'
            const queryAnswerResult = await db.query(queryForAnswers,[questionId])

            res.json({
                    question: queryQuestionResult.rows[0],
                    answers: queryAnswerResult.rows,
                    gameMode: gameMode,
                    allQuestionChecked: false
                }
            );
        }

    }
    catch (error){
        console.error('Error al cargar:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/CheckCommunityQuestion', async (req, res) =>{
    const {question_id} = req.body;

    try{
        const updateQuestionQuery = 'Update community_question set alreadypicked = $1 where community_question_id = $2'
        await db.query(updateQuestionQuery, [true ,question_id])
        res.json({message: 'Se actualizó la pregunta correctamente', id: question_id})
    }
    catch (error){
        console.log('Falla el update de la pregunta', error)
        res.status(500)
    }

});

router.post('/UncheckCommunityQuestion', async (req, res) =>{

    try {
        const updateQuestionQuery = 'Update community_question set alreadypicked = false'
        await db.query(updateQuestionQuery)
        res.json({message: 'Se actualizó la pregunta correctamente'})

    }
    catch (error){
        console.log('Fallo el update de la pregunta', error)
    }

})

module.exports = router;