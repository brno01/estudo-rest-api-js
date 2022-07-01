const mysql = require('../database/mysql').pool;

exports.getRequests = (req, res, next) => {
    mysql.query(`SELECT requests.id_request,
                        requests.id_client,
                        requests.quantity,
                        requests.create_date,
                        products.id_product,
                        products.name,
                        products.price,
                        products.image_product,
                        products.create_time
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
                        id_client: request.id_client,
                        quantity: request.quantity,
                        create_date: request.create_date,
                        product: {
                            id_product: request.id_product,
                            name: request.name,
                            price: request.price,
                            create_time: request.create_time,
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
};
exports.getRequestsbyID = (req, res, next) => {
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
                    create_date: result[0].create_date,
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
};
exports.postRequests = (req, res, next) => {
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
};
exports.patchRequests = (req, res, next) => {
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
};
exports.deleteRequests = (req, res, next) => {
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
};