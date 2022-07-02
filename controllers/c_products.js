const mysql = require('../database/mysql');

exports.getProducts = async (req, res, next) => {
    try {
        const result = await mysql.execute('SELECT * FROM products;')
        const response = {
            quantity: result.length,
            products: result.map(prod => {
                return {
                    id_product: prod.id_product,
                    name: prod.name,
                    price: prod.price,
                    id_categorie: prod.id_categorie,
                    url: prod.url,
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
    } catch (error) {
        return res.status(500).send({error: error});
    }
};

//;(//    }).catch((error) => {
//        console.log(error);
//    }
//);};
//exports.getProducts = (req, res, next) => {;
//    mysql.query(
//        'SELECT * FROM products;',
//        (error, result, fields) => {
//            if (error) {return res.status(500).send({
//                message: 'Não foi possível cadastrar o cliente. :(',
//                error : error 
//            })}
//            if (result.length == 0) {
//                return res.status(404).send({
//                    message: 'Não há produtos cadastrados! :('
//                })
//            }
//            const response = {
//                quantity: result.length,
//                products: result.map(prod => {
//                    return {
//                        id_product: prod.id_product,
//                        name: prod.name,
//                        price: prod.price,
//                        id_categorie: prod.id_categorie,
//                        url: prod.url,
//                        create_time: prod.create_time,
//                        request: {
//                            tipo: 'GET',
//                            descricao: 'Retorna os detalhes de um product específico:',
//                            url: 'http://localhost:3000/products/' + prod.id_product
//                        }
//                    }
//                })
//            }
//        return res.status(200).send(response);
//        }
//    )
//};

exports.getProductsbyID = (req, res, next) => {
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
                    url: result[0].url,
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
};
exports.postProduct = (req, res, next) => {
    mysql.query(
        'INSERT INTO products (id_product, id_categorie, name, price, url) VALUES (?,?,?,?,?)',
        [
            req.body.id_product, 
            req.body.id_categorie, 
            req.body.name, 
            req.body.price,
            req.body.url
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
                    url: req.body.url,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos:',
                        url: 'http://localhost:3000/products'
                    }
                }
            });
        }
    )
};
exports.patchProduct = (req, res, next) => {
    mysql.query(
        "UPDATE products SET name = ?, price = ?, id_categorie = ?, create_time = ?, url = ? WHERE id_product = '?' ",
        [
            req.body.name, 
            req.body.price, 
            req.body.id_categorie,
            req.body.create_time,
            req.body.url,
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
                    create_time: req.body.create_time,
                    url: req.body.url,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos:',
                        url: 'http://localhost:3000/products' + req.body.id_product
                    }
                }
            });
        }
    )
};
exports.deleteProduct = (req, res, next) => {
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

};