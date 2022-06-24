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
                nome: result.length,
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

// RETORNA OS DADOS DE UMA CATEGORIA ESPECÍFICO
router.get('/:id_categoria', (req, res, next) =>{
    const id = req.params.id_categoria

    if (id === 'exclusivo') {
    res.status(200).send({
        mensagem: 'Detalhes dessa categoria',
        id: id_categoria
    });
} else {
        res.status(200).send({
        mensagem:'ID da categoria:'
        });
    }
});

// ALTERA UMA CATEGORIA
router.patch('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Categoria Alterada'
    });
});

// EXCLUI UMA CATEGORIA
router.delete('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Categoria Excluída'
    });
});

module.exports = router;