const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Pagina de lab1');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

