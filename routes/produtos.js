const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


// RETORNA TODOS OS PRODUTOS // Valor: FLOAT
router.get('/', (req, res, next) => {
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
                            valor: prod.valor,
                            id_categoria: prod.id_categoria,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto específico:',
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
router.post('/', upload.single('produto_imagem'), (req, res, next) => {
        console.log(req.file);
        mysql.query(
            'INSERT INTO produtos (id_produto, id_categoria, nome, valor, imagem_produto) VALUES (?,?,?,?,?)',
            [
                req.body.id_produto, 
                req.body.id_categoria, 
                req.body.nome, 
                req.body.valor,
                req.file.path
            ],
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error: error, response: null });
                }
                res.status(201).send({
                    mensagem: 'Produto Inserido com sucesso :)',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        valor: req.body.valor,
                        id_categoria: result.id_categoria,
                        imagem_produto: req.file.path,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos:',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                });
            }
        )
    });
    
// RETORNA OS DADOS DE UM PRODUTO ESPECÍFICO
router.get('/:id_produto', (req, res, next) => {
    mysql.query(
        'SELECT * from produtos where id_produto = ?;',
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
                    valor: result[0].valor,
                    id_categoria: result[0].id_categoria,
                    imagem_produto: result[0].imagem_produto,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos:',
                        url: 'http://localhost:3000/produtos'
                    }
                }
            }
            return res.status(200).send(response);
        }
    )
});

// ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    mysql.query(
        `UPDATE produtos
                SET nome = ?
                   valor = ?
            id_categoria = ?
        where id_produto = ?`,
        [
            req.body.nome, 
            req.body.valor, 
            req.body.id_categoria,
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
                    valor: req.body.valor,
                    id_categoria: req.body.id_categoria,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos:',
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
        'DELETE from produtos where id_produto = ?',[req.body.id_produto],
        (error,result,fields) => {
            if (error) {return res.status(500).send({ error: error, response: null })}
            const response = {
                mensagem: 'Produto removido com sucesso!',
                request: {
                    tipo: 'POST',
                    descricao: 'Insere um produto:',
                    url: 'http://localhost:3000/produtos',
                } 
            }
            return res.status(202).send(response);
        }
    )

});

module.exports = router;    