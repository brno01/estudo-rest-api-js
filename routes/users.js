const express = require('express');
const router = express.Router();
const UserController = require('../controllers/c_users');

router.post('/signup', UserController.postUserCreate); //Cria um usuário de autenticação.
router.post('/signin', UserController.postUserAuth); //Autentica o usuário.

module.exports = router;