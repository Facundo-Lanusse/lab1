const express = require('express');
const router = express.Router();
const db = require('../database');


router.get('/FetchCommunityCategoriesPending', async (req, res) => {
    try{
        const categoriesQuery = 'Select name, community_category_id from community_category where publish_state = $1';
        const categoryQueryResult = await db.query(categoriesQuery,['pending']);
        res.json(categoryQueryResult.rows);

    }
    catch(err){
        console.error("Al traer categorias", err);
        res.status(500).json({ error: 'Fallo la consulta' });
    }
});


router.get('/FetchQuestionAndAnswersFromPendingCategories/:categoryId', async (req, res) => {

        try{
            const categoryId = req.params.categoryId;

            const questionAndAnswersQuery = `select cq.question_text, 
            ca.answer_text,
            cq.community_question_id, 
            ca.community_question_id,  
            ca.is_correct from community_category cc
            join Community_question cq on cq.community_category_id = cc.community_category_id
            join community_answer ca on ca.community_question_id = cq.community_question_id
            where cc.community_category_id = $1`;

            const queryQuestionAndAnswerResult = await db.query(questionAndAnswersQuery, [categoryId]);

                res.json({
                        questionAndAnswers: queryQuestionAndAnswerResult.rows
                    }
                );
        }


        catch (error){
            console.error('Error al cargar:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
});


router.put("/UpdateCommunityCategoryState", async (req, res) => {
    const {status ,categoryId} = req.body;
    try{
        const updateCategoryQuery = 'Update community_category set publish_state = $1 where community_category_id = $2'
        await db.query(updateCategoryQuery, [status, categoryId])
        res.status(200).json({message: 'all passed'})
    }
    catch (error){
        console.error('Error al cargar:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})


module.exports = router;