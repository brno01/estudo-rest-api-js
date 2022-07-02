const mysql = require('../database/mysql').pool;

exports.getCategories = (req, res, next) => {
    mysql.query(
        'SELECT * FROM categories;',
        (error, result, fields) => {
            if (error) {return res.status(500).send({ 
                message: 'Erro ao listar as categorias!',
                error : error 
            })}
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não há categorias cadastradas. :('
                })
            }
            const response = {
                quantity: result.length,
                categories: result.map(categorie => {
                    return {
                        id_categorie: categorie.id_categorie,
                        name: categorie.name,
                        create_time: categorie.create_time,
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
};
exports.getCategoriesbyID = (req, res, next) => {
    mysql.query(
        'SELECT * FROM categories WHERE id_categorie = ?;',
        [req.params.id_categorie],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ 
                message: 'Erro ao listar essa categoria. :(',
                error : error 
            })}
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não foi encontrado uma categoria com esse ID :('
                })
            }
            const response = {
                categorie: {
                    id_categorie: result[0].id_categorie,
                    name: result[0].name,
                    create_time: result[0].create_time,
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
};
exports.postCategorie = (req, res, next) => {
    mysql.query(
        'INSERT INTO categories (id_categorie, name) VALUES (?,?)',
        [
            req.body.id_categorie, 
            req.body.name
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ 
                message: 'Erro ao inserir a categoria. :(',
                error : error 
            })}
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
};
exports.patchCategorie = (req, res, next) => {
    mysql.query(
        "UPDATE categories SET name = ? WHERE id_categorie = '?' ",
        [ 
            req.body.name,
            req.body.id_categorie
        ],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ 
                message: 'Erro ao atualizar a categoria. :(',
                error : error 
            })}
            if (result.length == 0) {
                return res.status(404).send({
                    message: 'Não foi encontrado uma categoria com esse ID :('
                })
            }
            const response = {
                categorie: {
                    id_categorie: result[0].id_categorie,
                    name: req.body.name,
                    request: {
                        type: 'GET',
                        description: 'Retorna todas as categorias:',
                        url: 'http://localhost:3000/categories'
                    }
                }
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
        });
};
exports.deleteCategorie =  (req, res, next) => {
    mysql.query(
        `DELETE from categories WHERE id_categorie = ?`,[req.body.id_categorie],
        (error,result,fields) => {
            if (error) {return res.status(500).send({ 
                message: 'Erro ao deletar a categoria. :(',
                error : error 
            })}
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
};