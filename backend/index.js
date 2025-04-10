const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const validateUser = require('./middleware/authenticationMiddleware.js');
//import validateUser from  "./middleware/authenticationMiddleware.js";


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const {response} = require("express");

const app = express();
    app.use(cors()); // Permite que el frontend acceda al backend
    app.use(cookieParser());
    app.use(bodyParser.json());
    //app.use(validateUser);

app.listen(3000, () => {

    console.log('Servidor corriendo en http://localhost:3000/api/register');
});


// Registrar usuario
app.post('/api/register',async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Por favor, completá todos los campos.' });
    }

    try {
        const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *';
        const result = await db.query(query, [username, password, email]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener lista de usuarios
app.get('/api/users', validateUser, async (req, res) => {
    try {
        console.log(req.users)
        const query = 'SELECT user_id, username, email FROM users';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        res.status(500).json({ error: 'Fallo la consulta' });
    }
});

// Eliminar usuario
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM users WHERE user_id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
//manejo sesiones
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body; //declaro las variables que le voy a pedir al body (La pagina)
    try {
        const query = 'SELECT * FROM USERS WHERE email = $1 AND password = $2'; //Digo como es la consulta con los inputs
        const userQuery = await db.query(query, [email, password]); //Ejecuto la consulta en la query

        if (userQuery.rows.length > 0) { //chequeo si existe algún usuario con esos parámetros
            const user = userQuery.rows[0];
            const token = jwt.sign({id: user.id, username: user.username}, process.env.SECRET_JWT_KEY, {
                expiresIn: '1h'
            })

            return res
                .json({
                    message: 'Logueado correctamente',
                    user: { id: user.id, email: user.email, username: user.username, is_admin: user.is_admin},
                    token: token //le paso el token generado
                });//Envio al front el mensaje de login correcto y todos los datos necesarios
        } else {
            return res.status(401).json({ error: 'Credenciales incorrectas' }); //Si falla la consulta solo mando el mensaje con el error
        }
    } catch (err) {
        console.error('Error al loguear:', err); //Error para que veamos en consola
        res.status(500).json({ error: 'Error al procesar la solicitud' });//De nuevo cambio el error
    }
});

app.post('/api/uploadQuestion',async (req, res) => {
    const { categoryName, questionText} = req.body;
    if (!categoryName || !questionText ) {
        return res.status(400).json({ error: 'Por favor, completá todos los campos.' });
    }

    try {
        const queryForCategory = 'SELECT * FROM category where name = $1';
        const resultForCategoryQuery = await db.query(queryForCategory, [categoryName]);
        const categoryId = resultForCategoryQuery.rows[0].category_id;
        const queryForQuestion = 'INSERT INTO question(question, category_id) VALUES ($1,$2) RETURNING *';
        const result = await db.query(queryForQuestion, [questionText, categoryId]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al cargar pregunta:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});



