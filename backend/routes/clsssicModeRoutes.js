const express = require('express');
const router = express.Router();
const db = require('../database');
const { validateFriendship, validateBattleExists, validateUserTurn } = require('../middleware/battleMiddleware');
const {route} = require("express/lib/application");

// Ruta para iniciar una batalla - usamos validateFriendship como middleware
router.post('/classic/start', validateFriendship, async (req, res) => {
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
        INSERT INTO battle_categories (battle_id, user_id, category_id, completed)
        VALUES ($1, $2, $3, false)
        `;
        await db.query(insertCategoryQuery, [battleid, userId, categoryId]);
    }
}

// Ruta para obtener información de una batalla - usamos validateBattleExists como middleware
router.get('/classic/battle/:battleId', validateBattleExists, async (req, res) => {
    // Ya tenemos la batalla en req.battle gracias al middleware
    res.json({
        success: true,
        battle: req.battle
    });
});

// Esta ruta obtiene el estado de la batalla - usamos validateBattleExists
router.get('/classic/battle/:battleId/state', validateBattleExists, async (req, res) => {
    try {
        const battleId = req.params.battleId;
        const battle = req.battle; // Usamos la batalla que ya fue validada por el middleware

        console.log('[DEBUG] Estado de batalla solicitado:', {
            battleId,
            user_id1: battle.user_id1,
            tipoUser_id1: typeof battle.user_id1,
            user_id2: battle.user_id2,
            tipoUser_id2: typeof battle.user_id2,
            whos_next: battle.whos_next,
            tipoWhos_next: typeof battle.whos_next
        });

        // Busco estado de las categorías
        const categoriesQuery = `
        select bc.user_id, bc.category_id, bc.completed, c.name
        from battle_categories bc
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

        console.log('[DEBUG] Enviando respuesta de estado de batalla:', {
            currentTurn: battle.whos_next,
            tipoDatoCurrTurn: typeof battle.whos_next,
            categoriasTotales: categoriesResult.rowCount,
            categoriasUser1: user1Categories.length,
            categoriasUser2: user2Categories.length,
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
router.get('/classic/battle/:battleId/questions', validateBattleExists, async (req, res) => {
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
router.post('/classic/battle/:battleId/answer', validateBattleExists, validateUserTurn, async (req, res) => {
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

       // Verificar primero si ya existe una respuesta para esta combinación batalla-usuario-pregunta
       const checkExistingAnswerQuery = `
         SELECT * FROM battle_answer 
         WHERE battle_id = $1 AND user_id = $2 AND question_id = $3
       `;
       const existingAnswer = await db.query(checkExistingAnswerQuery, [battleId, userId, questionId]);

       // Si ya existe una respuesta, actualizamos en lugar de insertar
       if (existingAnswer.rows.length > 0) {
         const updateAnswerQuery = `
           UPDATE battle_answer
           SET answer_id = $1, is_correct = $2, answer_time = now()
           WHERE battle_id = $3 AND user_id = $4 AND question_id = $5
           RETURNING *
         `;
         await db.query(updateAnswerQuery, [answerId, isCorrect, battleId, userId, questionId]);
       } else {
         // Si no existe, registramos la respuesta como antes
         const recordAnswerQuery = `
           INSERT INTO battle_answer (battle_id, question_id, answer_id, user_id, is_correct, answer_time)
           VALUES ($1, $2, $3, $4, $5, now())
           RETURNING *
         `;
         await db.query(recordAnswerQuery, [battleId, questionId, answerId, userId, isCorrect]);
       }

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
        and answer_time > (
            select coalesce(max(answer_time), date_trunc('minute', now()))
            from battle_answer
            where battle_id = $1 and user_id = $2 and is_correct = false
            )
        `;
       const correctResult = await db.query(correctAnswersQuery, [battleId, userId]);
       const correctCount = parseInt(correctResult.rows[0].count);

       console.log(`Usuario ${userId} tiene ${correctCount} respuestas correctas consecutivas`);

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
router.post('/classic/battle/:battleId/select-category', validateBattleExists, validateUserTurn, async (req, res) => {
    try {
        const battleId = req.params.battleId;
        const { categoryId, userId } = req.body;
        const battle = req.battle; // Usamos la batalla que ya fue validada por el middleware

        // Actualizo la categoria seleccionada
        const selectCategoryQuery = `
            update battle_categories
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

// Ruta para guardar el resultado de la partida
router.post('/classic/battle/:battleId/result', validateBattleExists, async (req, res) => {
    try {
        const battleId = req.params.battleId;
        const { userId, isWinner } = req.body;

        let winnerId = null;
        if (isWinner) {
            winnerId = userId;
        } else {
            winnerId = req.battle.user_id1 === parseInt(userId) ? req.battle.user_id2 : req.battle.user_id1;
        }
        // Actualizar el estado de la batalla
        const updateBattleQuery = `
            UPDATE battle
            SET status = 'completed'
            WHERE battle_id = $1
            RETURNING *
        `;

        await db.query(updateBattleQuery, [battleId]);

        // Guardar en la tabla history
        const createHistoryQuery = `
            INSERT INTO history (battle_id, result, winner_user_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        await db.query(createHistoryQuery, [
            battleId,
            isWinner ? 'win' : 'loss',
            winnerId
        ]);

        // Actualizar los puntos del usuario
        const updatePointsQuery = `
            UPDATE users
            SET rank_points = rank_points + $1
            WHERE user_id = $2
        `;

        // Si ganó, le damos más puntos
        await db.query(updatePointsQuery, [isWinner ? 10 : 2, userId]);

        res.json({
            success: true,
            message: 'Resultado de la partida guardado correctamente'
        });
    } catch (error) {
        console.error('Error al guardar resultado de la partida:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar el resultado de la partida'
        });
    }
});

// Ruta para obtener las batallas de un usuario (activas y completadas)
router.get('/classic/battles', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el ID del usuario'
            });
        }

        // Consulta para obtener todas las batallas donde participa el usuario
        const battlesQuery = `
            SELECT b.battle_id, b.user_id1, b.user_id2, b.status, b.whos_next, b.date, 
                   h.winner_user_id as winner_id,
                   CASE WHEN b.user_id1 = $1 THEN u2.username ELSE u1.username END as opponent_name,
                   (SELECT COUNT(*) FROM battle_categories 
                    WHERE battle_id = b.battle_id AND user_id = $1 AND completed = true) as myCompletedCategories,
                   (SELECT COUNT(*) FROM battle_categories 
                    WHERE battle_id = b.battle_id AND user_id != $1 AND completed = true) as opponentCompletedCategories
            FROM battle b
            JOIN users u1 ON b.user_id1 = u1.user_id
            JOIN users u2 ON b.user_id2 = u2.user_id
            LEFT JOIN history h ON b.battle_id = h.battle_id
            WHERE (b.user_id1 = $1 OR b.user_id2 = $1)
            ORDER BY b.status = 'ongoing' DESC, b.date DESC
        `;

        const result = await db.query(battlesQuery, [userId]);

        // Formatear los datos para el frontend
        const battles = result.rows.map(battle => ({
            battle_id: battle.battle_id,
            opponent_name: battle.opponent_name,
            currentTurn: battle.whos_next,
            date: battle.date,
            myCompletedCategories: Number(battle.mycompletedcategories),
            opponentCompletedCategories: Number(battle.opponentcompletedcategories),
            status: battle.status,
            winner_id: battle.winner_id,
            isWinner: battle.winner_id === Number(userId),
            isCompleted: battle.status === 'completed'
        }));

        res.json({
            success: true,
            battles
        });
    } catch (error) {
        console.error('Error al obtener batallas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las batallas'
        });
    }
});

// Endpoint para pasar el turno voluntariamente
router.post('/classic/battle/:battleId/pass-turn', validateBattleExists, validateUserTurn, async (req, res) => {
    try {
        const { battleId } = req.params;
        const { userId } = req.body;
        const battle = req.battle; // Obtenido desde el middleware

        // Determina quién es el siguiente jugador
        const nextPlayer = battle.user_id1 === userId ? battle.user_id2 : battle.user_id1;

        // Actualiza el turno en la base de datos
        const updateTurnQuery = `
            update battle
            set whos_next = $1
            where battle_id = $2
            returning *
        `;
        await db.query(updateTurnQuery, [nextPlayer, battleId]);

        res.json({
            success: true,
            message: 'Turno pasado al oponente exitosamente'
        });
    } catch (error) {
        console.error('Error al pasar el turno:', error);
        res.status(500).json({
            success: false,
            message: 'Error al pasar el turno'
        });
    }
});

module.exports = router;
