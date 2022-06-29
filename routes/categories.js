const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;



// RETORNA TODAS AS CATEGORIAS
router.get('/', (req, res, next) =>{
    console.log()
    mysql.query(
        'SELECT * from categories;',
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error : error })}
            const response = {
                quantity: result.length,
                categories: result.map(categorie => {
                    return {
                        id_categorie: categorie.id_categorie,
                        name: categorie.name,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de uma categoria específica:',
                            url: 'http://localhost:3000/categories/' + categorie.id_categorie
                        }
                    }
                })
            }
        return res.status(200).send(response);
        }
    )
});

// INSERE UMA CATEGORIA
router.post('/', (req, res, next) => {
    console.log()
    mysql.query(
        'INSERT INTO categories (id_categorie, name) VALUES (?,?)',
        [
            req.body.id_categorie, 
            req.body.name
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error : error, response: null });
            }
            res.status(201).send({
                message: 'Categoria criada com sucesso! :)',
                categorieCreated: {
                    id_categorie: result.id_categorie,
                    name: req.body.name,
                    request: {
                        type: 'GET',
                        description: 'Retorna todas as categorias:',
                        url: 'http://localhost:3000/produtos'
                    }
                }
            });
        }
    )
});

// RETORNA OS DADOS DE UMA CATEGORIA ESPECÍFICA
router.get('/:id_categorie', (req, res, next) =>{
    console.log()
    mysql.query(
        'SELECT * from categories where id_categorie = ?;',
        [req.params.id_categorie],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error : error });
        }
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não foi encontrado a categoria com esse ID :('
                })
            }
            const response = {
                categorie: {
                    id_categorie: result[0].id_categorie,
                    name: result[0].name,
                    request: {
                        type: 'GET',
                        description: 'Retorna todas as categorias:',
                        url: 'http://localhost:3000/categories'
                    }
                }
            }
            return res.status(200).send(response);
        }
    )
});

// ALTERA UMA CATEGORIA
router.patch('/', (req, res, next) =>{
    console.log()
    mysql.query(
        "UPDATE categories SET name = ? WHERE id_categorie = '?' ",
        [ 
            req.body.name,
            req.body.id_categorie
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send( {error : error, response: null });
            }
            res.status(202).send({
                message: 'Categoria alterada com sucesso :)',
                categorieUpdated: {
                    id_categorie: req.body.id_categorie,
                    name: req.body.name,
                    request: {
                        type: 'GET',
                        description: 'Retorna todas as categorias:',
                        url: 'http://localhost:3000/categories' + req.body.id_categorie
                    }
                }
            });
        }
    )
});

// EXCLUI UMA CATEGORIA
router.delete('/', (req, res, next) =>{
    console.log()
    mysql.query(
        `DELETE from categories WHERE id_categorie = ?`,[req.body.id_categorie],
        (error,result,fields) => {
            if (error) {return res.status(500).send({ error : error, response: null })}
            const response = {
                message: 'Categoria removida com sucesso!',
                request: {
                    type: 'POST',
                    description: 'Insere uma categorie:',
                    url: 'http://localhost:3000/categories',
                } 
            }
            return res.status(202).send(response);
        }
    )
});

module.exports = router;