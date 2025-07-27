const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');
const express = require("express");
const router = express.Router();

router.post('/friendRequest:id', async (req, res) => {
    const { username, friendId } = req.body;
    try {
        const checkFriendQuery = 'select * from users where username = $1';
        const checkFriendExistResult = await db.query(checkFriendQuery,[username]);
        if (checkFriendExistResult.rows < 1) {
            res.status(404).send({message: 'No se encontro al usuario'});
        }
        else{
            const userId = checkFriendExistResult.rows[0].user_id;
            const checkFriendQuery = 'select * from friends where user_id = $1 and friend_id=$2';
            const checkFriendResult = await db.query(checkFriendQuery,[userId, friendId]);
            if (checkFriendResult.rows > 1) {
                res.status(404).send({message: 'Ya eres amigo de este usuario'});
            }
            else{
                const friendRequestQuery = 'insert into friends(user_id, friend_id) VALUES ($1, $2) ';
                await db.query(friendRequestQuery,[userId, friendId]);
            }
            res.status(200).send({message: 'Solicitud enviada con exito'});
        }
    }
    catch (err) {
        console.log('Error al crear solicitud',err);
        res.status(400).send({message: 'Error al enviar solicitud'});
    }
})

router.delete('/deleteFriend:id', async (req, res) => {
    const { userId, friendId } = req.body;
    console.log(userId, friendId);
    try {
        const checkFriendQuery = 'select * from friends where user_id = $1 and friend_id=$2 or user_id=$2 and friend_id=$1';
        const checkFriendResult = await db.query(checkFriendQuery,[userId, friendId]);
        if (checkFriendResult.rows < 1) {
            res.status(404).send({message: 'No existe está amistad'});
        }
        else{
            const deleteFriendQuery = 'delete from friends where user_id = $1 and friend_id=$2 returning *';
            await db.query(deleteFriendQuery,[userId, friendId]);
            res.status(200).send({message: 'Amigo eliminado correctamente'});
        }
    }
    catch (err) {
        console.log('Error al eliminar amistad',err);
        res.status(400).send({message: 'Error al enviar solicitud'});
    }
})

router.get('/friends', async (req, res) => {
    try {

        const userId = parseInt(req.query.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'ID de usuario no válido' });
        }


        const query = `
            SELECT u.user_id, u.username, u.email, u.rank_points
            FROM users u
                     JOIN friends f ON u.user_id = f.friend_id
            WHERE f.user_id = $1 AND f.state = 'accepted'
            UNION
            SELECT u.user_id, u.username, u.email, u.rank_points
            FROM users u
                     JOIN friends f ON u.user_id = f.user_id
            WHERE f.friend_id = $1 AND f.state = 'accepted'
        `;

        const result = await db.query(query, [userId]);

        console.log(`Encontrados ${result.rows.length} amigos para el usuario ${userId}`);

        res.status(200).json({
            friends: result.rows
        });
    } catch (error) {
        console.error('Error al obtener amigos:', error);
        res.status(500).json({
            message: 'Error al cargar los amigos'
        });
    }
});

router.get('/getFriendId/', async (req, res) => {

    try {
        const username = req.query.username;

        const query = 'SELECT user_id FROM users WHERE username = $1';
        const result = await db.query(query, [username]);
        if (result.rows.length < 1) {
            return res.status(404).json({ message: 'No existe el usuario' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error al buscar amigo:', error);
        res.status(500).json({
            message: 'Error al buscar amigo'
        });
    }
});

router.put('/updateFriendState', async (req, res) => {
    const { friendId, userId } = req.body;
    try{
        const query = 'UPDATE friends SET state = $1 WHERE user_id = $2 AND friend_id = $3';
        await db.query(query, ['accepted', userId, friendId]);
        res.json({message: 'Estado de amistad actualizado correctamente'});

    }
    catch (error) {
        console.error('Error al actualizar estado de amistad:', error);
        res.status(500).json({
            message: 'Error al actualizar estado de amistad'
        });
    }
})

router.post("/sendFriendRequest", async (req, res) => {
    try {
        const { friendId, userId } = req.body;
        const requestQuery = 'INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)';
        await db.query(requestQuery, [userId, friendId]);
        res.json({message: 'Solicitud de amistad enviada correctamente'});
    }
    catch (error) {
        console.error('Error al enviar solicitud de amistad:', error);
        res.status(500).json({
            message: 'Error al enviar solicitud de amistad'
        });
    }
});

router.get('/pendingRequests', async (req, res) => {
    try {
        const userId = parseInt(req.query.userId);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'ID de usuario no válido' });
        }

        const query = `
            SELECT u.user_id, u.username, u.email, f.friend_id as request_id
            FROM users u
                     JOIN friends f ON u.user_id = f.user_id
            WHERE f.friend_id = $1 AND f.state = 'pending'
        `;

        const result = await db.query(query, [userId]);

        console.log(`Encontradas ${result.rows.length} solicitudes pendientes para el usuario ${userId}`);

        res.status(200).json({
            pendingRequests: result.rows
        });
    } catch (error) {
        console.error('Error al obtener solicitudes de amistad:', error);
        res.status(500).json({
            message: 'Error al cargar las solicitudes de amistad'
        });
    }
});

router.put('/acceptRequest', async (req, res) => {
    try {
        const { requestId } = req.body;

        const query = `
            UPDATE friends
            SET state = 'accepted'
            WHERE friend_id = $1
            RETURNING *
        `;

        const result = await db.query(query, [requestId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        res.status(200).json({
            message: 'Solicitud aceptada',
            request: result.rows[0]
        });
    } catch (error) {
        console.error('Error al aceptar solicitud:', error);
        res.status(500).json({
            message: 'Error al procesar la solicitud'
        });
    }
});

router.delete('/rejectRequest', async (req, res) => {
    try {
        const { requestId } = req.body;

        const query = `
            DELETE FROM friends
            WHERE friend_id = $1
            RETURNING *
        `;

        const result = await db.query(query, [requestId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        res.status(200).json({
            message: 'Solicitud rechazada'
        });
    } catch (error) {
        console.error('Error al rechazar solicitud:', error);
        res.status(500).json({
            message: 'Error al procesar la solicitud'
        });
    }
});




module.exports = router;