const mysql = require('../database/mysql');

exports.getRequests = async (req, res, next) => {
    const result = await mysql.execute(`SELECT requests.id_request,
                       requests.id_client,
                       requests.quantity,
                       requests.total_price,
                       requests.create_date,
                       products.id_product,
                       products.name,
                       products.price,
                       products.image_product,
                       products.create_time
                  FROM requests
               INNER JOIN products
                       ON products.id_product = requests.id_product;`);
    const response = {
        'quantity(all)': result.length,
        'Todos os pedidos': result.map(request => {
            return {
                id_request: request.id_request,
                id_client: request.id_client,
                quantity: request.quantity,
                total_price: request.total_price,
                create_date: request.create_date,
                product: {
                    id_product: request.id_product,
                    name: request.name,
                    price: request.price,
                    create_time: request.create_time,
                },                        
                request: {
                    type: 'GET',
                    description: 'Retorna os detalhes de um pedido específico:',
                    url: process.env.URL_API + 'requests/' + request.id_request,
                }
            }
        })
    }
};
//exports.getRequests = (req, res, next) => {
//    mysql.query(`SELECT requests.id_request,
//                        requests.id_client,
//                        requests.quantity,
//                        requests.create_date,
//                        products.id_product,
//                        products.name,
//                        products.price,
//                        products.image_product,
//                        products.create_time
//                   FROM requests
//                INNER JOIN products
//                        ON products.id_product = requests.id_product;`,
//        (error, result, fields) => {
//            if (error) {return res.status(500).send({
//                message: 'Não foi possível visualizar os pedidos. :(',
//                error : error 
//            })}
//            if (result.length == 0) {
//                return res.status(404).send({
//                    message: 'Não há pedidos feitos :('
//                })
//            }
//            const response = {
//                quantity: result.length,
//                requests: result.map(request => {
//                    return {
//                        id_request: request.id_request,
//                        id_client: request.id_client,
//                        quantity: request.quantity,
//                        create_date: request.create_date,
//                        product: {
//                            id_product: request.id_product,
//                            name: request.name,
//                            price: request.price,
//                            create_time: request.create_time,
//                        },                        
//                        request: {
//                            type: 'GET',
//                            description: 'Retorna os detalhes de um pedido específico:',
//                            url: process.env.URL_API + 'requests/' + request.id_request,
//                        }
//                    }
//                })
//            }
//        return res.status(200).send(response);
//        }
//    )
//};

exports.getRequestsbyID = async (req, res, next) => {
    try {
        const result = await mysql.execute('SELECT * FROM requests WHERE id_request = ?;', [req.params.id_request]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado um pedido com esse ID'
            })
        }
        const response = {
            request: {
                id_request: result[0].id_request,
                id_product: result[0].id_product,
                quantity: result[0].quantity,
                create_date: result[0].create_date,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os pedidos:',
                    url: process.env.URL_API + 'requests/',
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};
//exports.getRequestsbyID = (req, res, next) => {
//    mysql.query(
//        'SELECT * from requests where id_request = ?;',
//        [req.params.id_request],
//        (error, result, fields) => {
//            if (error) {return res.status(500).send({
//                message: 'Não foi possível visualizar este pedido. :(',
//                error : error 
//            })}
//            if (result.length == 0) {
//                return res.status(404).send({
//                    message: 'Não foi encontrado o pedido com esse ID'
//                })
//            }
//            const response = {
//                request: {
//                    id_request: result[0].id_request,
//                    id_product: result[0].id_product,
//                    quantity: result[0].quantity,
//                    create_date: result[0].create_date,
//                    request: {
//                        type: 'GET',
//                        description: 'Retorna todos os pedidos:',
//                        url: process.env.URL_API + 'requests/',
//                    }
//                }
//            }
//            return res.status(200).send(response);
//        }
//    )
//};

exports.postRequests = async (req, res, next) => {
    try {
        const query =  'INSERT INTO requests (id_client, id_product, quantity) VALUES (?,?,?)';
        const result = mysql.execute(query, [
            req.body.id_client,
            req.body.id_product,
            req.body.quantity,
        ]);
        const response = {
            message: 'Pedido criado com sucesso :)',
                requestCriado: {
                    id_product: req.body.id_product,
                    quantity: req.body.quantity,
                    request: {
                        type: 'GET',
                        description: 'Retorna todos os pedidos:',
                        url: process.env.URL_API + 'requests/',
                    }
                }
            }
            return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};
//exports.postRequests = (req, res, next) => {
//    mysql.query(
//        'INSERT INTO requests (id_client, id_product, quantity) VALUES (?,?,?)',
//        [
//            req.body.id_client, 
//            req.body.id_product, 
//            req.body.quantity
//        ],
//        (error, result, fields) => {
//            if (error) {return res.status(500).send({
//                message: 'Não foi possível realizar este pedido. :(',
//                error : error 
//            })}
//            return res.status(201).send({
//                message: 'Pedido criado com sucesso :)',
//                requestCriado: {
//                    id_product: req.body.id_product,
//                    quantity: req.body.quantity,
//                    request: {
//                        type: 'GET',
//                        description: 'Retorna todos os pedidos:',
//                        url: process.env.URL_API + 'requests/',
//                    }
//                }
//            });
//        }
//    )
//};

exports.patchRequest = async (req, res, next) => {
    try {
        const result = await mysql.execute("UPDATE requests SET id_product = ?, quantity = ?, id_client = ? WHERE id_request = ?", [
            req.body.id_product,
            req.body.quantity,
            req.body.id_client,
            req.params.id_request,
        ]);
        const response ={
            message: 'Pedido alterado com sucesso :)',
            requestUpdated: {
                id_request: req.body.id_request,
                name: req.body.name,
                request: {
                    type: 'GET',
                    description: 'Retorna todas os pedidos:',
                    url: process.env.URL_API + 'requests/',
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};
//exports.patchRequests = (req, res, next) => {
//    mysql.query(
//        "UPDATE requests SET id_product = ?, quantity = ?, id_client = ? WHERE id_request = '?' ",
//        [ 
//            req.body.quantity,
//            req.body.id_request
//        ],
//        (error, result, fields) => {
//            if (error) {return res.status(500).send({
//                message: 'Não foi possível atualizar o pedido. :(',
//                error : error 
//            })}
//            if (result.length == 0) {
//                return res.status(404).send({
//                    message: 'Não foi encontrado um pedido com esse ID :('
//                })
//            }
//            res.status(202).send({
//                message: 'Pedido alterado com sucesso :)',
//                requestUpdated: {
//                    id_request: req.body.id_request,
//                    name: req.body.name,
//                    request: {
//                        type: 'GET',
//                        description: 'Retorna todas os pedidos:',
//                        process.env.URL_API + 'requests/',
//                    }
//                }
//            });
//        }
//    )
//};

exports.deleteRequest = async (req, res, next) => {
    try {
        const result = await mysql.execute("DELETE FROM requests WHERE id_request = ?", [req.params.id_request]);
        const response = {
            message: 'Pedido excluído com sucesso :)',
            requestExcluido: {
                id_request: req.params.id_request,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os pedidos:',
                    url: process.env.URL_API + 'requests/',
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};
//exports.deleteRequests = (req, res, next) => {
//    mysql.query(
//        `DELETE from requests where id_request = ?`,[req.body.id_request],
//        (error,result,fields) => {
//            if (error) {return res.status(500).send({
//                message: 'Não foi possível remover este pedido. :(',
//                error : error 
//            })}
//            const response = {
//                message: 'Pedido removido com sucesso!',
//                request: {
//                    type: 'POST',
//                    description: 'Insere um pedido:',
//                    url: 'http://localhost:3000/requests',
//                } 
//            }
//            return res.status(202).send(response);
//        }
//    )
//};