const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;



// RETORNA TODOS OS PEDIDOS // ID, Nome, NB: Number, Numeração de Base, Categoria(WIP)
router.get('/', (req, res, next) => {
    mysql.query(`SELECT pedidos.id_pedido,
                        pedidos.id_usuario,
                        pedidos.quantidade,
                        produtos.id_produto,
                        produtos.nome,
                        produtos.valor,
                        produtos.id_categoria
                    FROM pedidos
                INNER JOIN produtos
                        ON produtos.id_produto = pedidos.id_produto;`,
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error: error })}
            const response = {
                quantidade: result.length,
                pedidos: result.map(pedido => {
                    return {
                        id_pedido: pedido.id_pedido,
                        quantidade: pedido.quantidade,
                        produto: {
                            id_produto: pedido.id_produto,
                            nome: pedido.nome,
                            valor: pedido.valor
                        },                        
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um pedido específico:',
                            url: 'http://localhost:3000/pedidos/' + pedido.id_pedido
                        }
                    }
                })
            }
        return res.status(200).send(response);
        }
    )
});

// INSERE UM PEDIDO
router.post('/', (req, res, next) =>{
    mysql.query(
        'INSERT INTO pedidos (id_usuario, id_produto, quantidade) VALUES (?,?,?)',
        [
            req.body.id_usuario, 
            req.body.id_produto, 
            req.body.quantidade
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error: error, response: null });
            }
            return res.status(201).send({
                mensagem: 'Pedido criado com sucesso :)',
                pedidoCriado: {
                    id_produto: req.body.id_produto,
                    quantidade: req.body.quantidade,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os pedidos:',
                        url: 'http://localhost:3000/pedidos'
                    }
                }
            });
        }
    )
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) =>{
    mysql.query(
        'SELECT * from pedidos where id_pedido = ?;',
        [req.params.id_pedido],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error: error });
        }
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado o pedido com esse ID'
                })
            }
            const response = {
                pedido: {
                    id_pedido: result[0].id_pedido,
                    id_produto: result[0].id_produto,
                    quantidade: result[0].quantidade,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os pedidos:',
                        url: 'http://localhost:3000/pedidos'
                    }
                }
            }
            return res.status(200).send(response);
        }
    )
});

// EXCLUI UM PEDIDO
router.delete('/', (req, res, next) =>{
    mysql.query(
        `DELETE from pedidos where id_pedido = ?`,[req.body.id_pedido],
        (error,result,fields) => {
            if (error) {return res.status(500).send({ error: error, response: null })}
            const response = {
                mensagem: 'Pedido removido com sucesso!',
                request: {
                    tipo: 'POST',
                    descricao: 'Insere um pedido:',
                    url: 'http://localhost:3000/pedidos',
                } 
            }
            return res.status(202).send(response);
        }
    )
});

module.exports = router;