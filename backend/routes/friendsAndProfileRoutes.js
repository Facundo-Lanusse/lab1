const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');
const express = require("express");
const router = express.Router();

router.put('/editProfile/:username', validateUser, async (req, res) => {
    const { username, userId } = req.body;
    try {
        const checkNameQuery = 'select username from users where username = $1'
        const checkNameResult = await db.query(checkNameQuery,[username]);
        if (checkNameResult.rows.length > 0) {
            res.status(400).send({message: 'El nombre de usuario ya existe'});
        }
        else{
            const updateNameQuery = 'update users set username=$1 where user_id=$2';
            await db.query(updateNameQuery,[username, userId]);
            res.status(200).send({message: 'Nombre de usuario cambiado correctamente'});
        }
    }
    catch (err) {
        console.log('Error al cargar el perfil desde la db',err);
        res.status(400).send({message: 'No se pudo cargar el perfil'})
    }
})


router.put('/editProfile/:email', validateUser, async (req, res) => {
    const { email, userId } = req.body;
    try {
        const checkEmailQuery = 'select email from users where email = $1'
        const checkEmailResult = await db.query(checkEmailQuery,[email]);
        if (checkEmailResult.rows.length > 0) {
            res.status(400).send({message: 'Este correo ya ha sido utilizado'});
        }
        else{
            const updateEmailQuery = 'update users set email=$1 where user_id=$2';
            await db.query(updateEmailQuery,[email, userId]);
            res.status(200).send({message: 'Corre cambiado correctamente'});
        }
    }
    catch (err) {
        console.log('Error al cargar el perfil desde la db',err);
        res.status(400).send({message: 'No se pudo cargar el perfil'})
    }
})

router.put('/editProfile/:password', validateUser, async (req, res) => {
    const { password, userId } = req.body;
    try {
        const checkPasswordQuery = 'select password from users where password = $1'
        const checkPasswordResult = await db.query(checkPasswordQuery,[password]);
        if (checkPasswordResult.rows.length > 0) {
            res.status(400).send({message: 'Contraseña ya usada en este usuario'});
        }
        else{
            const updatePasswordQuery = 'update users set email=$1 where user_id=$2';
            await db.query(updatePasswordQuery,[password, userId]);
            res.status(200).send({message: 'Contraseña cambiada correctamente'});
        }
    }
    catch (err) {
        console.log('Error al cargar el perfil desde la db',err);
        res.status(400).send({message: 'No se pudo cargar el perfil'})
    }
})


router.post('/friendRequest:id', validateUser, async (req, res) => {
    const { username, friendId } = req.body;
    try {
        const checkFriendQuery = 'select * from users where username = $1';
        const checkFriendResult = await db.query(checkFriendQuery,[username]);
        if (checkFriendResult.rows < 1) {
            res.status(404).send({message: 'No se encontro al usuario'});
        }
        else{
            const userId = checkFriendResult.rows[0].user_id;
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

router.delete('/deleteFriend:id', validateUser, async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const checkFriendQuery = 'select * from friends where user_id = $1 and friend_id=$2';
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



//todo: Faltaria lo de las imagenes del perfil, ya cree la tabla

module.exports = router;