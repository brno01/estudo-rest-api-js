const mysql = require('../database/mysql');

exports.getRequests = async (req, res, next) => {
    try {
        const result = await mysql.execute(`SELECT 
                                requests.id_request, 
                                requests.id_client,
                                requests.quantity, 
                                requests.total_price,
                                requests.create_time, 
                                products.id_product,
                                products.name, 
                                products.price, 
                                products.url, 
                                products.create_time 
                FROM requests 
                INNER JOIN products 
                    ON products.id_product = requests.id_product;`);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não há pedidos neste momento. :('
        })};
        const response = {
            'quantity(all)': result.length,
            'Todos os pedidos': result.map(request => {
                return {id_request: request.id_request, id_client: request.id_client, quantity: request.quantity, total_price: request.total_price, create_date: request.create_date,
                    product: {id_product: request.id_product, name: request.name, price: request.price, create_time: request.create_time,},                        
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de um pedido específico:',
                        url: process.env.URL_API + 'requests/' + request.id_request,
                    }
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao listar os pedidos!', error : error});
    }
};
exports.getRequestbyID = async (req, res, next) => {
    try {
        const result = await mysql.execute('SELECT * FROM requests WHERE id_request = ?;', [req.params.id_request]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado um pedido com esse ID'
            })};
        const response = {
            request: {id_request: result[0].id_request, id_product: result[0].id_product, quantity: result[0].quantity, create_date: result[0].create_date,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os pedidos:',
                    url: process.env.URL_API + 'requests/',
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao buscar por este produto', error : error
        });
    }
};
exports.postRequest = async (req, res, next) => {
    try {
        const query =  'INSERT INTO requests (id_product, id_client, quantity) VALUES (?,?,?)';
        const result = mysql.execute(query, [req.body.id_product, req.body.id_client, req.body.quantity]);
        const response = {
            message: 'Pedido criado com sucesso :)',
                requestCriado: {id_product: req.body.id_product, quantity: req.body.quantity, id_client: req.body.id_client,
                    request: {
                        type: 'GET',
                        description: 'Retorna todos os pedidos:',
                        url: process.env.URL_API + 'requests/',
                    }
                }
            }
            return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao cadastrar este produto', error : error
        });
    }
};
exports.patchRequest = async (req, res, next) => {
    try {
        const result = await mysql.execute("UPDATE requests SET id_product = ?, quantity = ?, id_client = ? WHERE id_request = ?", [req.body.id_product, req.body.quantity, req.body.id_client, req.params.id_request]);
        const response ={
            message: 'Pedido alterado com sucesso :)',
            requestUpdated: {id_request: req.body.id_request, name: req.body.name,
                request: {
                    type: 'GET',
                    description: 'Retorna todas os pedidos:',
                    url: process.env.URL_API + 'requests/',
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao atualizar este produto!', error : error
        });
    }
};
exports.deleteRequest = async (req, res, next) => {
    try {
        const result = await mysql.execute("DELETE FROM requests WHERE id_request = '?'", [req.params.id_request]);
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
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao remover este produto do registro', error : error
        });
    }
};