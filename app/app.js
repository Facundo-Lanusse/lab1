const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');//seteo para que se use path
app.set('view engine', 'ejs');//seteo el motor de views
app.set('views', path.join(__dirname, 'views'));//digo donde buscar las views

//todo: Falta manejar como se borran usarios desde admin

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

const db = require('./database');
const {response} = require("express");

// middleware para usar formularios
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('registerView');
});

app.post('/register', async (req, res) => {
    const {username, password, email} = req.body; // defino las variables del body

    if (!username || !password) {
        return res.send('Por favor, completá todos los campos.'); // si falta alguno tire msg
    }

        try {
            const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *';
            const result = await db.query(query, [username, password, email]);
            res.send(`
        <h3>Usuario registrado con éxito.</h3> 
        <a href="/">Volver</a>
        <h3>${JSON.stringify(result.rows)}</h3>
        <form action="/register" method="POST">
    `);//todo: esto deberia cambiarse por una view, usar res render como use en /admin
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).send('Error en el servidor');// 500 = error de servidor
        }

});

app.get('/admin', async (req, res)=>{
    try{
        const query = 'select username, email from users'
        const result = await db.query(query)
        res.render('adminView', { users: result.rows });
        //hago una query sencilla y la mando a la adminView para que imprima con listas los users
    }
    catch (error){
        console.error('Error al cargar usuarios:', error);
        res.status(400).send('Fallo la consulta')
    }

} );
