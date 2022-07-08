const mysql = require('../database/mysql');

exports.getProducts = async (req, res, next) => {
    try {
        const result = await mysql.execute('SELECT * FROM products;')
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não há produtos cadastrados. :('
        })};
        const response = {
            'quantity(all)': result.length,
            'Todos os produtos': result.map(products => {
                return {id_product: products.id_product, name: products.name, price: products.price, id_categorie: products.id_categorie, url: products.url, create_time: products.create_time,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um product específico:',
                        url: process.env.URL_API + 'product/' + products.id_product
                    }
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao listar os produtos!', error : error
        });
    }
};
exports.getProductbyID = async (req, res, next) => {
    try {
        const result = await mysql.execute('SELECT * FROM products WHERE id_product = ?;', [req.params.id_product]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado o produto com esse ID'
            })
        }
        const response = {
            product: {id_product: result[0].id_product, name: result[0].name, price: result[0].price, id_categorie: result[0].id_categorie, url: result[0].url, create_time: result[0].create_time,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os produtos:',
                    url: process.env.URL_API + 'products/'
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao listar os produtos!', error : error 
        });
    }
};
exports.postProduct = async (req,res,next) => {
    try {
        const query = 'INSERT INTO products (name, price, id_categorie, url) VALUES (?,?,?,?)';
        const result = mysql.execute(query, [req.body.name, req.body.price, req.body.id_categorie, req.body.url]);
        const response = {
            message: 'Produto criado com sucesso!',
            productCreated: {name: req.body.name, price: req.body.price, id_categorie: req.body.id_categorie, url: req.body.url,
                request: {
                    tipo: 'POST',
                    descricao: 'Retorna todos os produtos:',
                    url: process.env.URL_API + 'products/',
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao cadastrar este produto', error : error
        });
    }
};
exports.patchProduct = async (req, res, next) => {
    try {
        const result = await mysql.execute("UPDATE products SET name = ?, price = ?, id_categorie = ?, create_time = ?, url = ? WHERE id_product = '?' ",
        [req.body.name, req.body.price, req.body.id_categorie, req.body.create_time, req.body.url, req.body.id_product]);
        const response = {
            message: 'Produto alterado com sucesso :)',
                productAtualizado: {id_product: req.body.id_product, name: req.body.name, price: req.body.price, id_categorie: req.body.id_categorie, create_time: req.body.create_time, url: req.body.url,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos:',
                        url: process.env.URL_API + 'products/',
                    }
                }
            }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao atualizar este produto', error : error
        });
    }
};
exports.deleteProduct = async (req, res, next) => {
    try {
        const result = await mysql.execute("DELETE FROM products WHERE id_product = '?' ",[req.body.id_product]);
        const response = {
            message: 'Produto deletado com sucesso! :)',
                productDeletado: {id_product: req.body.id_product,
                    request: {
                        type: 'POST',
                        description: 'Insere um produto:',
                        url: process.env.URL_API + 'products/'
                    }
                }
            }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao apagar este produto dos registros', error : error
        });
    }
};