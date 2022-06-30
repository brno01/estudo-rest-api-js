const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const RequestsController = require('../controllers/c_requests');

router.get('/', auth.open, RequestsController.getRequests); //Retorna os pedidos | Não é necessário atenticar para acessar a rota.
router.get('/:id_request', auth.open, RequestsController.getRequestsbyID); //Retorna um pedido específico | Não é necessário atenticar para acessar a rota.
router.post('/', auth.required, RequestsController.postRequests); //Cria um novo pedido | É necessário autenticar para acessar a rota.
router.patch('/', auth.required, RequestsController.patchRequests); //Atualiza um pedido | É necessário autenticar para acessar a rota.
router.delete('/', auth.required, RequestsController.deleteRequests); //Deleta um pedido | É necessário autenticar para acessar a rota.

module.exports = router;