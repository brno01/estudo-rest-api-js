const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const mysql = require('../database/mysql').pool;

// RETORNA TODOS OS clienteS
router.get('/', auth, (req, res, next) => {
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
                        create_time: client.create_time,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de um cliente específico:',
                            url: 'http://localhost:3000/clients/' + client.id_client
                        }
                    }
                })
            }
        return res.status(200).send(response);
        }
    )
});

// INSERE UM cliente
router.post('/', auth, (req, res, next) => {
    mysql.query(
        'INSERT INTO clients (id_client, name, login, password, birthdate, gender, email, phone) VALUES (?,?,?,?,?,?,?,?)',
        [
            req.body.id_client, 
            req.body.name,
            req.body.login,
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
                message: 'Cliente criado com sucesso! :)',
                clientCreated: {
                    id_client: result.id_client,
                    name: req.body.name,
                    login: req.body.login,
                    password: req.body.password,
                    birthdate: req.body.birthdate,
                    gender: req.body.gender,
                    email: req.body.email,
                    phone: req.body.phone,
                    create_time: result.create_time,
                    request: {
                        type: 'GET',
                        description: 'Retorna todos os clientes:',
                        url: 'http://localhost:3000/clients'
                    }
                }
            });
        }
    )
});

// RETORNA OS DADOS DE UM CLIENTE ESPECÍFICO
router.get('/:id_client', auth, (req, res, next) => {
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
                    login: result[0].login,
                    password: result[0].password,
                    birthdate: result[0].birthdate,
                    gender: result[0].gender,
                    email: result[0].email,
                    phone: result[0].phone,
                    create_time: result[0].create_time,
                    request: {
                        type: 'GET',
                        description: 'Retorna todos os clientes:',
                        url: 'http://localhost:3000/clients'
                    }
                }
            }
            return res.status(200).send(response);
        }
    )
});

// ALTERA UM CLIENTE
router.patch('/', auth, (req, res, next) => {
    mysql.query(
    "UPDATE clients SET name = ?, login = ?, password = ?, birthdate =?, gender = ?, email = ?, phone = ?  WHERE id_client = '?' ",
    [
        req.body.name, req.body.login,
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
                message: 'Cliente alterado com sucesso! :)',
                clientUpdated: {
                    id_client: req.body.id_client,
                    name: req.body.name,
                    request: {
                        type: 'GET',
                        description: 'Retorna todos os dados deste cliente:',
                        url: 'http://localhost:3000/clients/' + req.body.id_client
                    }
                }
            });
        }
    )
});

// EXCLUI UM CLIENTE
router.delete('/', auth, (req, res, next) => {
    mysql.query(
        "DELETE FROM client WHERE id_client = ?",[req.body.id_client],
        (error,result,fields) => {
            if (error) {return res.status(500).send({ error: error, response: null })}
            const response = {
                message: 'Cliente removido com sucesso!',
                request: {
                    type: 'POST',
                    description: 'Insere um cliente:',
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