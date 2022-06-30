const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const multer = require('multer');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
        let date = new Date().toISOString().replace(/:/g, '-') + '-';
        callback(null, date + file.originalname );
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


// RETORNA TODOS OS PRODUTOS // Price|Valor = FLOAT
router.get('/', auth.open, (req, res, next) => {;
        mysql.query(
            'SELECT * FROM products;',
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error : error })}
                if (result.length == 0) {
                    return res.status(404).send({
                        message: 'Não há produtos cadastrados! :('
                    })
                }
                const response = {
                    quantity: result.length,
                    products: result.map(prod => {
                        return {
                            id_product: prod.id_product,
                            name: prod.name,
                            price: prod.price,
                            id_categorie: prod.id_categorie,
                            image_product: prod.image_product,
                            create_time: prod.create_time,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um product específico:',
                                url: 'http://localhost:3000/products/' + prod.id_product
                            }
                        }
                    })
                }
            return res.status(200).send(response);
            }
        )
});

// INSERE UM PRODUTO
router.post('/', upload.single('image_product'), auth.required, (req, res, next) => {
        mysql.query(
            'INSERT INTO products (id_product, id_categorie, name, price, image_product) VALUES (?,?,?,?,?)',
            [
                req.body.id_product, 
                req.body.id_categorie, 
                req.body.name, 
                req.body.price,
                req.file.path
            ],
            (error, result, fields) => {
                if (error) {return res.status(500).send({ error : error, response: null });
                }
                res.status(201).send({
                    message: 'Produto inserido com sucesso! :)',
                    productCriado: {
                        id_product: req.body.id_product,
                        name: req.body.name,
                        price: req.body.price,
                        id_categorie: req.body.id_categorie,
                        image_product: req.file.path,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos:',
                            url: 'http://localhost:3000/products'
                        }
                    }
                });
            }
        )
    });
    
// RETORNA OS DADOS DE UM PRODUTO ESPECÍFICO
router.get('/:id_product', auth.open, (req, res, next) => {
    mysql.query(
        'SELECT * FROM products WHERE id_product = ?;',
        [req.params.id_product],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error : error });
        }
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não foi encontrado o produto com esse ID'
                })
            }
            const response = {
                product: {
                    id_product: result[0].id_product,
                    name: result[0].name,
                    price: result[0].price,
                    id_categorie: result[0].id_categorie,
                    image_product: result[0].image_product,
                    create_time: result[0].create_time,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os products:',
                        url: 'http://localhost:3000/products'
                    }
                }
            }
            return res.status(200).send(response);
        }
    )
});

// ALTERA UM PRODUTO
router.patch('/', auth.required, (req, res, next) => {
    mysql.query(
        "UPDATE products SET name = ?, price = ?, id_categorie = ? WHERE id_product = '?' ",
        [
            req.body.name, 
            req.body.price, 
            req.body.id_categorie,
            req.body.id_product
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send( {error : error, response: null });
            }
            res.status(202).send({
                message: 'Produto alterado com sucesso :)',
                productAtualizado: {
                    id_product: req.body.id_product,
                    name: req.body.name,
                    price: req.body.price,
                    id_categorie: req.body.id_categorie,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos:',
                        url: 'http://localhost:3000/products' + req.body.id_product
                    }
                }
            });
        }
    )
});
  
// EXCLUI UM PRODUTO
router.delete('/', auth.required, (req, res, next) => {
    mysql.query(
        'DELETE FROM products WHERE id_product = ?',[req.body.id_product],
        (error,result,fields) => {
            if (error) {return res.status(500).send({ error : error, response: null })}
            const response = {
                message: 'Produto removido com sucesso!',
                request: {
                    tipo: 'POST',
                    descripton: 'Insere um produto:',
                    url: 'http://localhost:3000/products',
                } 
            }
            return res.status(202).send(response);
        }
    )

});

module.exports = router;