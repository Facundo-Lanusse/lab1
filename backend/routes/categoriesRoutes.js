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
    const {name} = req.body;
    try {

        const createCategoryQuery = 'insert into category(name) values($1) ';
        await db.query(createCategoryQuery, [name]);
        res.json({ success: 'Categoria creada exitosamente'});
    }
    catch (err) {
        console.error("Error al crear categoria", err);
        res.status(500).json({ error: 'Error al crear categoria' });
    }
})

router.post('/ModifyCategory', async (req, res) => {
    const {oldName, newName} = req.body;
    try {
        const modifyCategoryQuery = 'UPDATE category SET name = $1 WHERE TRIM(LOWER(name)) = TRIM(LOWER($2))';
        const result = await db.query(modifyCategoryQuery, [newName.trim(), oldName.trim()]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json({ success: 'Categoría modificada exitosamente' });
    }
    catch (err) {
        console.error("Error al modificar categoria", err);
        res.status(500).json({ error: 'Error al modificar categoria' });
    }
})


module.exports = router;