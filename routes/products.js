const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ProductsController = require('../controllers/c_products');

router.get('/', auth.open, ProductsController.getProducts); //Retorna todos os produtos | Não é necessário atenticar para acessar a rota.
router.get('/:id_product', auth.open, ProductsController.getProductsbyID); //Retorna um produto específico | Não é necessário atenticar para acessar a rota.
router.post('/', auth.required, ProductsController.postProduct); //Cria um novo produto | É necessário autenticar para acessar a rota.
router.patch('/', auth.required, ProductsController.patchProduct); //Atualiza um produto | É necessário autenticar para acessar a rota.
router.delete('/', auth.required, ProductsController.deleteProduct); //Deleta um produto | É necessário autenticar para acessar a rota.

module.exports = router;