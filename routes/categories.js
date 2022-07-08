const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CategoriesController = require('../controllers/c_categories');

router.get('/', auth.open, CategoriesController.getCategories); //Retorna as categorias | Não é necessário autenticar para acessar a rota.
router.get('/:id_categorie', auth.open, CategoriesController.getCategoriebyID); //Retorna uma categoria específica | Não é necessário autenticar para acessar a rota.
router.post('/', auth.required, CategoriesController.postCategorie); //Cria uma nova categoria | É necessário autenticar para acessar a rota.
router.patch('/', auth.required, CategoriesController.patchCategorie); //Atualiza uma categoria | É necessário autenticar para acessar a rota.
router.delete('/', auth.required, CategoriesController.deleteCategorie); //Deleta uma categoria | É necessário autenticar para acessar a rota.

module.exports = router;