const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const ProductsController = require('../controllers/c_products');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
        let date = new Date().toISOString().replace(/:/g, '-') + '-';
        callback(null, date + file.originalname );
    }
});
const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', auth.open, ProductsController.getProducts); //Retorna todos os produtos | Não é necessário atenticar para acessar a rota.
router.get('/:id_product', auth.open, ProductsController.getProductsbyID); //Retorna um produto específico | Não é necessário atenticar para acessar a rota.
router.post('/', auth.required, upload.single('image_product'), ProductsController.postProduct); //Cria um novo produto | É necessário autenticar para acessar a rota.
router.patch('/', auth.required, ProductsController.patchProduct); //Atualiza um produto | É necessário autenticar para acessar a rota.
router.delete('/', auth.required, ProductsController.deleteProduct); //Deleta um produto | É necessário autenticar para acessar a rota.

module.exports = router;