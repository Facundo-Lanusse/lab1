const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/FetchCategories', async (req, res) => {
    try{
        const categoriesQuery = 'Select name from category';
        const categoryQueryResult = await db.query(categoriesQuery);
        res.json(categoryQueryResult.rows);

    }
    catch(err){
        console.error("Al traer categorias", err);
        res.status(500).json({ error: 'Fallo la consulta' });
    }
})


router.post('/CreateCategory', async (req, res) => {
    const {categoryName} = req.body;
    try {

        const createCategoryQuery = 'insert into category(name) values($1) ';
        await db.query(createCategoryQuery, [categoryName]);
        res.json({ success: 'Categoria creada exitosamente'});
    }
    catch (err) {
        console.error("Error al crear categoria", err);
        res.status(500).json({ error: 'Error al crear categoria' });
    }
})

router.post('/ModifyCategory', async (req, res) => {
    const {categoryName} = req.body;
    try {
        const createCategoryQuery = 'update category set name = $1';
        await db.query(createCategoryQuery, [categoryName]);
        res.json({ success: 'Categoria modificada exitosamente'});
    }
    catch (err) {
        console.error("Error al modificar categoria", err);
        res.status(500).json({ error: 'Error al modificar categoria' });
    }
})


module.exports = router;