const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const ClientsController = require('../controllers/c_clients');

router.get('/', auth.required, ClientsController.getClients); //Retorna todos os clientes | É necessário autenticar para acessar a rota.
router.get('/:id_client', auth.required, ClientsController.getClientsbyID); //Retorna um cliente cadastrado |É necessário autenticar para acessar a rota.
router.post('/', auth.required, ClientsController.postClient); //Cria um acesso para o cliente | É necessário autenticar para acessar a rota.
router.patch('/', auth.required, ClientsController.patchClient); //Atualiza os dados do cliente | É necessário autenticar para acessar a rota.
router.delete('/', auth.required, ClientsController.deleteClient); //Deleta o acesso do cliente | É necessário autenticar para acessar a rota.

module.exports = router;