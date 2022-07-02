const mysql = require('../database/mysql');

exports.getCategories = async (req, res, next) => {
    try {
        const result = await mysql.execute ('SELECT * FROM categories;')
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não há categorias cadastradas. :('
        })};
        const response = {
            'quantity(all)': result.length,
            'Todas as categorias': result.map(categorie => {
                return {id_categorie: categorie.id_categorie, name: categorie.name, create_time: categorie.create_time,
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de uma categoria específica:',
                        url: process.env.URL_API + 'categories/' + categorie.id_categorie,
                    }
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ 
            message: 'Erro ao listar as categorias!', error : error 
        });
    }
};
exports.getCategoriebyID = async (req, res, next) => {
    try {
        const result = await mysql.execute ('SELECT * FROM categories WHERE id_categorie = ?;', [req.params.id_categorie]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado uma categoria com esse ID'
            })};
        const response = {id_categorie: result[0].id_categorie, name: result[0].name, create_time: result[0].create_time,
            request: {
                type: 'GET',
                description: 'Retorna todas as categorias:',
                url: process.env.URL_API + 'categories/' + result[0].id_categorie,
            }};
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao listar esta categoria!', error : error
        });
    }
};
exports.postCategorie = async (req, res, next) => {
    try {
        const query = 'INSERT INTO categories (name, id_categorie) VALUES (?, ?)';
        const result = mysql.execute(query, [req.body.name, req.body.id_categorie]);
        const response = {
            message: 'Categoria criada com sucesso!',
            categorieCreated: {
                id_categorie: req.body.insertId,
                name: req.body.name,
                request: {
                    type: 'GET',
                    description: 'Retorna os detalhes de uma categoria específica:',
                    url: process.env.URL_API + 'categories/',
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao cadastrar esta categoria', error : error
        });
    }
};
exports.patchCategorie = async (req, res, next) => {
    try {
        const result = await mysql.execute ('UPDATE categories SET name = ? WHERE id_categorie = ?;', [req.body.name, req.params.id_categorie]);
        const response = {
            message: 'Categoria alterada com sucesso!',
                categorieUpdated: {id_categorie: req.params.id_categorie, name: req.body.name, create_time: result.create_time,
                request: {
                type: 'GET',
                description: 'Retorna os detalhes de uma categoria específica:',
                url: process.env.URL_API + 'categories/' + categorie.id_categorie,
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao atualizar esta categoria', error : error
        });
    }
};
exports.deleteCategorie = async (req, res, next) => {
    try {
        const result = await mysql.execute ('DELETE FROM categories WHERE id_categorie = ?;', [req.params.id_categorie]);
        const response = {
            message: 'Categoria removida com sucesso!', 
            request: {
                categorieDeleted: {
                    id_categorie: req.body.id_categorie,
                    request: {
                        type: 'POST',
                        description: 'Para inserir uma nova categoria:',
                        url: process.env.URL_API + 'categories/',
                    }
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Erro ao apagar esta categoria do registro!', error : error});
    }
};