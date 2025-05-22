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

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// desecargar: npm install multer --save

// Configurar el almacenamiento para multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = '../client/public/uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB límite
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Solo imágenes permitidas');
        }
    }
});

router.post('/editProfile/upload-image', upload.single('profileImage'), async (req, res) => {
    try {
        const { userId } = req.body;
        const imagePath = req.file.path;

        // Comprobar si el usuario ya tiene una imagen de perfil
        const checkQuery = 'SELECT * FROM profile_image WHERE user_id = $1';
        const checkResult = await db.query(checkQuery, [userId]);

        let query;
        let params;

        if (checkResult.rows.length > 0) {
            // Actualizar la imagen existente
            query = 'UPDATE profile_image SET image_path = $1 WHERE user_id = $2';
            params = [imagePath, userId];
        } else {
            // Insertar nueva imagen
            query = 'INSERT INTO profile_image (user_id, image_path) VALUES ($1, $2)';
            params = [userId, imagePath];
        }

        await db.query(query, params);

        // Devolver la URL relativa para el frontend
        const clientPath = imagePath.replace('..\\client\\public', '');

        res.status(200).json({
            message: 'Imagen de perfil actualizada correctamente',
            imagePath: clientPath,
            success: true
        });
    } catch (err) {
        console.error('Error al subir la imagen de perfil:', err);
        res.status(500).json({
            message: 'Error al subir la imagen de perfil',
            success: false
        });
    }
});

router.get('/profile-image/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Consulta para obtener la ruta de la imagen de perfil almacenada en la base de datos
        const query = 'SELECT image_path FROM profile_image WHERE user_id = $1';
        const result = await db.query(query, [userId]);

        if (result.rows.length > 0) {
            const imagePath = result.rows[0].image_path;

            const clientPath = imagePath.replace('..\\client\\public', '');
            res.status(200).json({
                imagePath: clientPath,
                success: true
            });
        } else {
            // Si no hay imagen, devuelve una ruta por defecto
            res.status(200).json({
                imagePath: '/defaultProfileImage.png',
                success: true
            });
        }
    } catch (err) {
        console.error('Error al obtener la imagen de perfil:', err);
        res.status(500).json({
            message: 'Error al obtener la imagen de perfil',
            success: false
        });
    }
});

module.exports = router;