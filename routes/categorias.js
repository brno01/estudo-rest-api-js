const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;



// RETORNA TODAS AS CATEGORIAS
router.get("/", (req, res, next) =>{
    mysql.query(
        'SELECT * from categorias;',
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error: error })}
            const response = {
                quantidade: result.length,
                categorias: result.map(categoria => {
                    return {
                        id_categoria: categoria.id_categoria,
                        nome: categoria.nome,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de uma categoria específica',
                            url: 'http://localhost:3000/categorias/' + categoria.id_categoria
                        }
                    }
                })
            }
        return res.status(200).send(response);
        }
    )
});

// INSERE UMA CATEGORIA
router.post('/', (req, res, next) =>{
    mysql.query(
        "INSERT INTO categorias (id_categoria, nome) VALUES (?,?)",
        [req.body.id_categoria, req.body.nome],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error: error, response: null });
            }
            res.status(201).send({
                mensagem: 'Categoria criada com sucesso! :)',
                categoriaCriado: {
                    id_categoria: result.id_categoria,
                    nome: req.body.nome,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todas as categorias',
                        url: 'http://localhost:3000/produtos'
                    }
                }
            });
        }
    )
});

// RETORNA OS DADOS DE UMA CATEGORIA ESPECÍFICA
router.get('/:id_categoria', (req, res, next) =>{
    mysql.query(
        "SELECT * from categorias where id_categoria = ?;",
        [req.params.id_categoria],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error: error });
        }
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado a categoria com esse ID'
                })
            }
            const response = {
                categoria: {
                    id_categoria: result[0].id_categoria,
                    nome: result[0].nome,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todas as categorias',
                        url: 'http://localhost:3000/categorias'
                    }
                }
            }
            return res.status(200).send(response);
        }
    )
});

// ALTERA UMA CATEGORIA
router.patch('/', (req, res, next) =>{
    mysql.query(
        `UPDATE categorias
            SET nome = ?
    where id_categoria = ?`,
        [ 
        req.body.nome,
        req.body.id_categoria
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send( {error: error, response: null });
            }
            res.status(202).send({
                mensagem: 'Categoria alterada com sucesso :)',
                categoriaAtualizado: {
                    id_categoria: req.body.id_categoria,
                    nome: req.body.nome,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todas as categorias',
                        url: 'http://localhost:3000/categorias' + req.body.id_categoria
                    }
                }
            });
        }
    )
});

// EXCLUI UMA CATEGORIA
router.delete('/', (req, res, next) =>{
    mysql.query(
        `DELETE from categorias where id_categoria = ?`,[req.body.id_categoria],
        (error,result,fields) => {
            if (error) {return res.status(500).send({ error: error, response: null })}
            const response = {
                mensagem: 'Categoria removida com sucesso!',
                request: {
                    tipo: 'POST',
                    descricao: 'Insere uma categoria',
                    url: 'http://localhost:3000/categorias',
                    body: {
                        id_categoria: 'Number',
                        nome: 'String'
                    }
                } 
            }
            return res.status(202).send(response);
        }
    )
});

module.exports = router;