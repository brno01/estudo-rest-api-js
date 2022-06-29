const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;

// RETORNA TODOS OS USUÁRIOS
router.get('/', (req, res, next) => {
    console.log()
    mysql.query(
        "SELECT * FROM clients;",
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error : error })}
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não há clientes cadastrados :('
                })
            }
            const response = {
                quantity: result.length,
                clients: result.map(client => {
                    return {
                        id_client: client.id_client,
                        name: client.name,
                        email: client.email,
                        phone: client.phone,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de um usuário específico:',
                            url: 'http://localhost:3000/clients/' + client.id_client
                        }
                    }
                })
            }
        return res.status(200).send(response);
        }
    )
});

// INSERE UM USUÁRIO
router.post('/', (req, res, next) => {
    console.log()
    mysql.query(
        'INSERT INTO clients (id_client, name, username, password, birthdate, gender, email, phone) VALUES (?,?,?,?,?,?,?,?)',
        [
            req.body.id_client, 
            req.body.name,
            req.body.username,
            req.body.password,
            req.body.birthdate,
            req.body.gender,
            req.body.email,
            req.body.phone
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error : error, response: null });
            }
            res.status(201).send({
                message: 'Usuário criado com sucesso! :)',
                clientCreated: {
                    id_client: result.id_client,
                    name: req.body.name,
                    username: req.body.username,
                    password: req.body.password,
                    birthdate: req.body.birthdate,
                    gender: req.body.gender,
                    email: req.body.email,
                    phone: req.body.phone,
                    request: {
                        type: 'GET',
                        description: 'Retorna todos os usuários:',
                        url: 'http://localhost:3000/clients'
                    }
                }
            });
        }
    )
});

// RETORNA OS DADOS DE UM CLIENTE ESPECÍFICO
router.get('/:id_client', (req, res, next) => {
    console.log()
    mysql.query(
        'SELECT * FROM clients WHERE id_client = ?;',
        [req.params.id_client],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error : error });
        }
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não foi encontrado um cliente com esse ID :('
                })
            }
            const response = {
                client: {
                    id_client: result[0].id_client,
                    name: result[0].name,
                    username: result[0].username,
                    password: result[0].password,
                    birthdate: result[0].birthdate,
                    gender: result[0].gender,
                    email: result[0].email,
                    phone: result[0].phone,
                    request: {
                        type: 'GET',
                        description: 'Retorna todos os usuários:',
                        url: 'http://localhost:3000/clients'
                    }
                }
            }
            return res.status(200).send(response);
        }
    )
});

// ALTERA UM CLIENTE
router.patch('/', (req, res, next) => {
    console.log()
    mysql.query(
    "UPDATE clients SET name = ?, username = ?, password = ?, birthdate =?, gender = ?, email = ?, phone = ?  WHERE id_client = '?' ",
    [
        req.body.name, req.body.username,
        req.body.password,
        req.body.birthdate,
        req.body.gender, req.body.email,
        req.body.phone,
        req.body.id_client
    ],
        (error, result, fields) => {
            if (error) {return res.status(500).send( {error : error, response: null });
            }
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não foi encontrado um cliente com esse ID :('
                })
            }
            res.status(202).send({
                message: 'Usuário alterado com sucesso! :)',
                clientUpdated: {
                    id_client: req.body.id_client,
                    name: req.body.name,
                    request: {
                        type: 'GET',
                        description: 'Retorna todos os dados deste usuário:',
                        url: 'http://localhost:3000/clients/' + req.body.id_client
                    }
                }
            });
        }
    )
});

// EXCLUI UM USUÁRIO
router.delete('/', (req, res, next) =>{
    console.log()
    mysql.query(
        "DELETE FROM client WHERE id_client = ?",[req.body.id_client],
        (error,result,fields) => {
            if (error) {return res.status(500).send({ error: error, response: null })}
            const response = {
                message: 'Usuário removido com sucesso!',
                request: {
                    type: 'POST',
                    description: 'Insere um usuário:',
                    url: 'http://localhost:3000/client',
                    body: {
                        name: 'String',
                        id_client: 'Number'
                    }
                } 
            }
            return res.status(202).send(response);
        }
    )
});

module.exports = router;