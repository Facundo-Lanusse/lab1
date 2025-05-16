const db = require('../database');
const validateUser = require('../middleware/authenticationMiddleware');
const express = require("express");
const router = express.Router();

router.put('/editProfile/username', async (req, res) => {
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
            res.status(200).send({message: 'Nombre de usuario cambiado correctamente', username: username, id: userId});
        }
    }
    catch (err) {
        console.log('Error al cargar el perfil desde la db',err);
        res.status(500).send({message: 'No se pudo cargar el perfil'})
    }
})


router.put('/editProfile/email', async (req, res) => {
    const { email, userId } = req.body;
    try {
        const checkEmailQuery = 'select email from users where email = $1'
        const checkEmailResult = await db.query(checkEmailQuery,[email]);
        if (checkEmailResult.rows.length > 0) {
            res.status(400).send({message: 'Este correo ya ha sido utilizado por otra cuenta'});
        }
        else{
            const updateEmailQuery = 'update users set email=$1 where user_id=$2';
            await db.query(updateEmailQuery,[email, userId]);
            res.status(200).send({message: 'Correo cambiado correctamente'});
        }
    }
    catch (err) {
        console.log('Error al cargar el perfil desde la db',err);
        res.status(400).send({message: 'No se pudo cargar el perfil'})
    }
})

router.put('/editProfile/password', async (req, res) => {
    const { password, userId } = req.body;
    try {
        const checkPasswordQuery = 'select password from users where password = $1 and user_id=$2';
        const checkPasswordResult = await db.query(checkPasswordQuery,[password, userId]);
        if (checkPasswordResult.rows.length > 0) {
            res.status(400).send({message: 'Contraseña ya usada en este usuario'});
        }
        else{
            const updatePasswordQuery = 'update users set password=$1 where user_id=$2';
            await db.query(updatePasswordQuery,[password, userId]);
            res.status(200).send({message: 'Contraseña cambiada correctamente'});
        }
    }
    catch (err) {
        console.log('Error al cargar el perfil desde la db',err);
        res.status(400).send({message: 'No se pudo cargar el perfil'})
    }
})






//todo: Faltaria lo de las imagenes del perfil, ya cree la tabla

module.exports = router;