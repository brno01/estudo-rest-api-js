const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;

// RETORNA TODOS OS PRODUTOS // NB: Number, Numeração de Base
router.get("/", (req, res, next) => {
        mysql.query(
            'SELECT * from produtos;',
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error: error })}
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            nb: prod.nb,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto específico',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto 
                            }
                        }
                    })
                }
            return res.status(200).send(response);
            }
        )
});

// INSERE UM PRODUTO
router.post("/", (req, res, next) => {
        mysql.query(
            "INSERT INTO produtos (id_produto, nome, nb) VALUES (?,?,?)",
            [req.body.id_produto, req.body.nome, req.body.nb],
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error: error, response: null });
                }
                res.status(201).send({
                    mensagem: 'Produto Inserido com sucesso :)',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        nb: req.body.nb,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                });
            }
        )
    });
    
// RETORNA OS DADOS DE UM PRODUTO ESPECÍFICO
router.get("/:id_produto", (req, res, next) => {
    mysql.query(
        "SELECT * from produtos where id_produto = ?;",
        [req.params.id_produto],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error: error });
        }
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado o produto com esse ID'
                })
            }
            const response = {
                produto: {
                    id_produto: result[0].id_produto,
                    nome: result[0].nome,
                    nb: result[0].nb,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: 'http://localhost:3000/produtos'
                    }
                }
            }
            return res.status(200).send(response);
        }
    )
});

// ALTERA UM PRODUTO
router.patch("/", (req, res, next) => {
    mysql.query(
        `UPDATE produtos
            SET nome = ?,
                  nb = ?
    where id_produto = ?`,
        [ 
        req.body.nome,
        req.body.nb,
        req.body.id_produto
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send( {error: error, response: null });
            }
            res.status(202).send({
                mensagem: 'Produto alterado com sucesso :)',
                produtoAtualizado: {
                    id_produto: req.body.id_produto,
                    nome: req.body.nome,
                    nb: req.body.nb,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: 'http://localhost:3000/produtos' + req.body.id_produto
                    }
                }
            });
        }
    )
});
  
// EXCLUI UM PRODUTO
router.delete('/', (req, res, next) =>{
    mysql.query(
        `DELETE from produtos where id_produto = ?`,[req.body.id_produto],
        (error,result,fields) => {
            if (error) {return res.status(500).send({ error: error, response: null })}
            const response = {
                mensagem: 'Produto removido com sucesso!',
                request: {
                    tipo: 'POST',
                    descricao: 'Insere um produto',
                    url: 'http://localhost:3000/produtos',
                    body: {
                        nome: 'String',
                        nb: 'Number'
                    }
                } 
            }
            return res.status(202).send(response);
        }
    )

});

module.exports = router;    