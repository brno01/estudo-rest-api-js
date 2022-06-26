const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;

// RETORNA TODOS OS USUÁRIOS
router.get('/', (req, res, next) => {
    mysql.query(
        'SELECT * from usuarios;',
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error: error })}
            const response = {
                quantidade: result.length,
                usuarios: result.map(usuario => {
                    return {
                        id_usuario: usuario.id_usuario,
                        nome: usuario.nome,
                        email: usuario.email,
                        telefone: usuario.telefone,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um usuário específico:',
                            url: 'http://localhost:3000/usuarios/' + usuario.id_usuario
                        }
                    }
                })
            }
        return res.status(200).send(response);
        }
    )
});

// INSERE UM USUÁRIO
router.post('/', (req, res, next) => {
    mysql.query(
        'INSERT INTO usuarios (id_usuario, nome, login, senha, email, telefone) VALUES (?,?,?,?,?,?)',
        [req.body.id_usuario, req.body.nome, req.body.login, req.body.senha, req.body.email, req.body.telefone],
        (error, result, fields) => {
            if (error) {return res.status(500).send({ error: error, response: null });
            }
            res.status(201).send({
                mensagem: 'Usuário criado com sucesso! :)',
                usuarioCriado: {
                    id_usuario: result.id_usuario,
                    nome: req.body.nome,
                    login: req.body.login,
                    senha: req.body.senha,
                    email: req.body.email,
                    telefone: req.body.telefone,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os Usuários:',
                        url: 'http://localhost:3000/usuarios'
                    }
                }
            });
        }
    )
});

// RETORNA OS DADOS DE UM USUÁRIO ESPECÍFICO
router.get('/:id_usuario', (req, res, next) => {
mysql.query(
    'SELECT * from usuarios where id_usuario = ?;',
    [req.params.id_usuario],
    (error, result, fields) => {
        if (error) {return res.status(500).send({ error: error });
    }
        if (result.length == 0) {
            return res.status(404).send({
                mensagem: 'Não foi encontrado o usuário com esse ID :('
            })
        }
        const response = {
            usuario: {
                id_usuario: result[0].id_usuario,
                nome: result[0].nome,
                email: result[0].email,
                telefone: result[0].telefone,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os usuários:',
                    url: 'http://localhost:3000/usuarios'
                }
            }
        }
        return res.status(200).send(response);
    }
)
});

// ALTERA UM USUÁRIO
router.patch('/', (req, res, next) => {
mysql.query(
    `UPDATE usuarios
        SET nome = ?,
           login = ?,
           senha = ?,
           email = ?,
        telefone = ?
where id_usuario = ?`,
    [ 
    req.body.id_usuario,
    req.body.nome,
    req.body.login,
    req.body.senha,
    req.body.email,
    req.body.telefone,
    ],
    (error, result, fields) => {
        if (error) {return res.status(500).send( {error: error, response: null });
        }
        res.status(202).send({
            mensagem: 'Usuário alterado com sucesso! :)',
            usuarioAtualizado: {
                id_usuario: req.body.id_usuario,
                nome: req.body.nome,
                nb: req.body.nb,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os usuario:',
                    url: 'http://localhost:3000/usuario' + req.body.id_usuario
                }
            }
        });
    }
)
});

// EXCLUI UM usuario
router.delete('/', (req, res, next) =>{
mysql.query(
    `DELETE from usuario where id_usuario = ?`,[req.body.id_usuario],
    (error,result,fields) => {
        if (error) {return res.status(500).send({ error: error, response: null })}
        const response = {
            mensagem: 'usuario removido com sucesso!',
            request: {
                tipo: 'POST',
                descricao: 'Insere um usuario:',
                url: 'http://localhost:3000/usuario',
                body: {
                    nome: 'String',
                    nb: 'Number'
                }
            } 
        }
        return res.status(202).send(response);
    }
)

});

module.exports = router;