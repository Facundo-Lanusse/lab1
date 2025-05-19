const express = require('express');
const router = express.Router();
const db = require('../database');
const { validateFriendship, validateBattleExists, validateUserTurn } = require('../middleware/battleMiddleware');
const {route} = require("express/lib/application");

// Ruta para iniciar una batalla - usamos validateFriendship como middleware
router.post('/start', validateFriendship, async (req, res) => {
    const { userId, opponentId } = req.body;

    try {
        // Creamos la batalla
        const battleQuery = `
        INSERT INTO battle (user_id1, user_id2, status, whos_next, date) 
        VALUES ($1, $2, 'ongoing', $1, date_trunc('minute', now())) 
        RETURNING battle_id
        `;
        const result = await db.query(battleQuery, [userId, opponentId]);
        const battleId = result.rows[0].battle_id;

        // Inicializamos el registro de categorías para ambos jugadores
        await initializeCategories(battleId, userId);
        await initializeCategories(battleId, opponentId);

        res.status(201).json({
            success: true,
            battleId: battleId,
            message: 'Batalla creada con éxito'
        });
    } catch (error) {
        console.error('Error al crear batalla:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la batalla'
        });
    }
});

async function initializeCategories(battleid, userId) {
    // Obtenemos las categorías de preguntas
    const categoriesQuery = `
    SELECT category_id
    FROM category;
    `;
    const categoriesResult = await db.query(categoriesQuery);

    // Inicializamos el registro de categoria para el usuario para ver quien llega primero a completar 4
    for ( const category in categoriesResult.rows) {
        const categoryId = categoriesResult.rows[category].category_id;
        const insertCategoryQuery = `
        INSERT INTO battle_category (battle_id, user_id, category_id, completed)
        VALUES ($1, $2, $3, false)
        `;
        await db.query(insertCategoryQuery, [battleid, userId, categoryId]);
    }
}

// Ruta para obtener información de una batalla - usamos validateBattleExists como middleware
router.get('/battle/:battleId', validateBattleExists, async (req, res) => {
    // Ya tenemos la batalla en req.battle gracias al middleware
    res.json({
        success: true,
        battle: req.battle
    });
});

// Esta ruta obtiene el estado de la batalla - usamos validateBattleExists
router.get('/battle/:battleId/state', validateBattleExists, async (req, res) => {
    try {
        const battleId = req.params.battleId;
        const battle = req.battle; // Usamos la batalla que ya fue validada por el middleware

        // Busco estado de las categorías
        const categoriesQuery = `
        select bc.user_id, bc.category_id, bc.completed, c.name
        from battle_category bc
        join category c on bc.category_id = c.category_id
        where bc.battle_id = $1
        `;
        const categoriesResult = await db.query(categoriesQuery, [battleId]);

        // Organizo los datos por usuario
        const user1Categories = [];
        const user2Categories = [];

        // Recorro el resultado de la query y veo como viene cada uno
        categoriesResult.rows.forEach(row => {
            if (row.user_id === battle.user_id1) {
                user1Categories.push(row);
            } else {
                user2Categories.push(row);
            }
        });

        // Envio el resultado
        res.json({
            success: true,
            battle: {
                ...battle,
                user1Categories,
                user2Categories,
                currentTurn: battle.whos_next
            }
        });
    } catch (error) {
        console.error('Error al obtener el estado de la batalla:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el estado de la batalla'
        });
    }
});

// Esta ruta obtiene preguntas aleatorias - usamos validateBattleExists
router.get('/battle/:battleId/questions', validateBattleExists, async (req, res) => {
    try {
        const categoryId = req.query.categoryId;

        // Si batalla existe consigo una pregunta aleatoria de la categoria
        const questionsQuery = `
        select q.question_id, q.questiontext, q.alreadypicked
        from question q
        where q.category_id = $1
        order by random()
        limit 1
        `;
        const questionsResult = await db.query(questionsQuery, [categoryId]);

        if (questionsResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No hay preguntas disponibles para esta categoría'
            });
        }

        // Obtengo respuesta para esa pregunta
        const questionId = questionsResult.rows[0].question_id;
        const answerQuery = `
        select answer_id, text, is_correct
        from answer
        where question_id = $1
        `;
        const answerResult = await db.query(answerQuery, [questionId]);

        res.json({
            success: true,
            question: questionsResult.rows[0],
            answers: answerResult.rows
        });
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener preguntas'
        });
    }
});

// Ruta para procesar respuesta a pregunta - usamos validateBattleExists y validateUserTurn
router.post('/battle/:battleId/answer', validateBattleExists, validateUserTurn, async (req, res) => {
   try {
       const battleId = req.params.battleId;
       const { questionId, answerId, userId } = req.body;
       const battle = req.battle; // Usamos la batalla que ya fue validada por el middleware

       // Verifico si la respuesta es correcta
       const answerQuery = `
         select is_correct
         from answer
         where answer_id = $1 and question_id = $2;
       `;
       const answerResult = await db.query(answerQuery, [answerId, questionId]);

       if (answerResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Respuesta no encontrada'
            });
       }

       const isCorrect = answerResult.rows[0].is_correct;
       // Registro la respuesta
       const recordAnswerQuery = `
        insert into battle_answer (battle_id, question_id, answer_id, user_id, is_correct, answered_at)
        values ($1, $2, $3, $4, $5, now())
        returning *;
         `;
       await db.query(recordAnswerQuery, [battleId, questionId, answerId, userId, isCorrect]);

       // Si respuesta es incorrecta, cambio el turno
       if (!isCorrect) {
           const nextPlayer = battle.user_id1 === userId ? battle.user_id2 : battle.user_id1;
           const updateTurnQuery = `
            update battle
            set whos_next = $1
            where battle_id = $2
            `;

           await db.query(updateTurnQuery, [nextPlayer, battleId]);

           return res.json({
               success: true,
               correct: false,
               message: 'Respuesta incorrecta, es el turno del otro jugador',
               nextPlayer
           });
       }

       // Si es correcto verifico cuantas correctas lleva en ese turno
       const correctAnswersQuery = `
        select count(*) as count
        from battle_answer
        where battle_id = $1 and user_id = $2 and is_correct = true
        and answered_time > (
            select coalesce(max(answered_time), date_trunc('minute', now()))
            from battle_answer
            where battle_id = $1 and user_id = $2
            )
        `;
       const correctResult = await db.query(correctAnswersQuery, [battleId, userId]);
       const correctCount = correctResult.rows[0].count;

       if (correctCount >= 3) {
           // El jugador puede elegir una categoría
           return res.json({
               success: true,
               correct: true,
               canSelectCategory: true,
               message: '¡Respuesta correcta! Puedes elegir una categoría.'
           });
       } else {
           // El jugador puede continuar respondiendo
           return res.json({
               success: true,
               correct: true,
               canSelectCategory: false,
               correctCount: correctCount,
               message: `¡Respuesta correcta! Llevas ${correctCount} de 3.`
           });
       }
   } catch (error) {
        console.error('Error al procesar respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar respuesta'
        });
   }
});

// Ruta para seleccionar categoría - usamos validateBattleExists y validateUserTurn
router.post('/battle/:battleId/select-category', validateBattleExists, validateUserTurn, async (req, res) => {
    try {
        const battleId = req.params.battleId;
        const { categoryId, userId } = req.body;
        const battle = req.battle; // Usamos la batalla que ya fue validada por el middleware

        // Actualizo la categoria seleccionada
        const selectCategoryQuery = `
            update battle_category
            set completed = true
            where battle_id = $1 and user_id = $2 and category_id = $3
            returning *
        `;
        const result = await db.query(selectCategoryQuery, [battleId, userId, categoryId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        // Cambio el turno al otro jugador
        const nextPlayer = battle.user_id1 === userId ? battle.user_id2 : battle.user_id1;
        const updateTurnQuery = `
            update battle
            set whos_next = $1
            where battle_id = $2
        `;
        await db.query(updateTurnQuery, [nextPlayer, battleId]);

        res.json({
            success: true,
            message: 'Categoría seleccionada correctamente',
            nextPlayer: nextPlayer
        });
    } catch (error) {
        console.error('Error al seleccionar categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al seleccionar categoría'
        });
    }
});

module.exports = router;
