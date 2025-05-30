const express = require('express');
const router = express.Router();
const db = require('../database');



router.get('/FetchBulletQuestion', async (req, res) => {

    try{
        const randomQuestionQuery = 'SELECT * FROM bullet_questions where already_picked = false ORDER BY RANDOM() LIMIT 1';
        const queryQuestionResult = await db.query(randomQuestionQuery)

        if(!queryQuestionResult.rows[0]) {
            res.json({allQuestionChecked: true, message: 'Marcadas con éxito'})
        }
        else{
            const questionId = queryQuestionResult.rows[0].bullet_question_id;

            const queryForAnswers = 'SELECT * FROM bullet_answers where bullet_question_id = $1'
            const queryAnswerResult = await db.query(queryForAnswers,[questionId])

            res.json({
                    question: queryQuestionResult.rows[0],
                    bullet_answers: queryAnswerResult.rows,
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


router.post('/CheckBulletQuestion', async (req, res) =>{
    const {questionId} = req.body;
    try{
        const updateQuestionQuery = 'Update bullet_questions set already_picked = true where bullet_question_id = $1'
        await db.query(updateQuestionQuery, [questionId])
        res.json({message: 'Se actualizó la pregunta correctamente', id: questionId})
    }
    catch (error){
        console.log('Falla el update de la pregunta', error)
        res.status(500)
    }

});

router.post('/UncheckBulletQuestion', async (req, res) =>{

    try {
        const updateQuestionQuery = 'Update bullet_questions set already_picked = false'
        await db.query(updateQuestionQuery)
        res.json({message: 'Se actualizó la pregunta correctamente'})

    }
    catch (error){
        console.log('Fallo el update de la pregunta', error)
    }

});


router.post('/UploadUserBulletBestScore', async(req, res) =>{
    const {score, userId} = req.body;

    try {
        const fetchBestScoreQuery = 'SELECT best_bullet_score FROM bullet_ranking where bullet_user_id = $1'
        const bestScore = await db.query(fetchBestScoreQuery, [userId])

        if(bestScore < score){
            const uploadUserScoreQuery = 'update bullet_ranking set best_bullet_score = $1 where bullet_user_id = $2'
            await db.query(uploadUserScoreQuery, [score, userId])

        }

        res.json({message: 'Se actualizó bien el score: '+score})
    }
    catch (error){
        console.error('Error al actualizar score', error);
    }


})



module.exports = router;