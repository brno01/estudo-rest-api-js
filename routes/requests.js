const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;



// RETORNA TODOS OS PEDIDOS // ID, name, NB: Number, Numeração de Base, request(WIP)
router.get('/', (req, res, next) => {
    mysql.query(`SELECT requests.id_request,
                        requests.id_client,
                        requests.quantity,
                        products.id_product,
                        products.name,
                        products.price,
                        products.image_product
                   FROM requests
                INNER JOIN products
                        ON products.id_product = requests.id_product;`,
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error : error })}
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não há pedidos feitos :('
                })
            }
            const response = {
                quantity: result.length,
                requests: result.map(request => {
                    return {
                        id_request: request.id_request,
                        quantity: request.quantity,
                        product: {
                            id_product: request.id_product,
                            name: request.name,
                            price: request.price
                        },                        
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um pedido específico:',
                            url: 'http://localhost:3000/requests/' + request.id_request
                        }
                    }
                })
            }
        return res.status(200).send(response);
        }
    )
});

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    mysql.query(
        'INSERT INTO requests (id_client, id_product, quantity) VALUES (?,?,?)',
        [
            req.body.id_client, 
            req.body.id_product, 
            req.body.quantity
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error : error, response: null });
            }
            return res.status(201).send({
                message: 'Pedido criado com sucesso :)',
                requestCriado: {
                    id_product: req.body.id_product,
                    quantity: req.body.quantity,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os pedidos:',
                        url: 'http://localhost:3000/requests'
                    }
                }
            });
        }
    )
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_request', (req, res, next) => {
    mysql.query(
        'SELECT * from requests where id_request = ?;',
        [req.params.id_request],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error : error });
        }
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não foi encontrado o pedido com esse ID'
                })
            }
            const response = {
                request: {
                    id_request: result[0].id_request,
                    id_product: result[0].id_product,
                    quantity: result[0].quantity,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os pedidos:',
                        url: 'http://localhost:3000/requests'
                    }
                }
            }
            return res.status(200).send(response);
        }
    )
});

// ALTERA UM PEDIDO
router.patch('/', (req, res, next) => {
    mysql.query(
        "UPDATE requests SET id_product = ?, quantity = ?, id_client = ? WHERE id_request = '?' ",
        [ 
            req.body.quantity,
            req.body.id_request
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send( {error : error, response: null });
            }
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não foi encontrado um pedido com esse ID :('
                })
            }
            res.status(202).send({
                message: 'Pedido alterado com sucesso :)',
                requestUpdated: {
                    id_request: req.body.id_request,
                    name: req.body.name,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todas os pedidos:',
                        url: 'http://localhost:3000/requests' + req.body.id_request
                    }
                }
            });
        }
    )
});

// EXCLUI UM PEDIDO
router.delete('/', (req, res, next) => {
    mysql.query(
        `DELETE from requests where id_request = ?`,[req.body.id_request],
        (error,result,fields) => {
            if (error) {return res.status(500).send({ error : error, response: null })}
            const response = {
                message: 'Pedido removido com sucesso!',
                request: {
                    tipo: 'POST',
                    descricao: 'Insere um pedido:',
                    url: 'http://localhost:3000/requests',
                } 
            }
            return res.status(202).send(response);
        }
    )
});

module.exports = router;