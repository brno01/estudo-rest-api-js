const express = require('express');
const router = express.Router();


// RETORNA TODAS AS CATEGORIAS
router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Todas as categorias'
    });
});

// INSERE UMA CATEGORIA
router.post('/', (req, res, next) =>{
    const categoria = {
        nome: req.body.nome,
        categoria: req.body.categoria
    };
    res.status(201).send({
        mensagem: 'Insere uma categoria',
        categoriaCriada: categoria
    })
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