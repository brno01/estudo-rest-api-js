const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');
const { response } = require('express');

router.post('/signup', (req, res, next) => {
    console.log(bcrypt)
    req = (
        (error, result, fields) => {
            bcrypt.hash(req.body.password, 10, (errorBcrypt, hash) => {
                if (errorBcrypt) {return res.status(500).send({ error : errorBcrypt });
            }
            mysql.query(
                `INSERT INTO users (email, password) VALUES (?,?)`, 
                [
                    req.body.email, 
                    hash
                ],
                response = {
                    message: 'Usuário criado com sucesso!',
                    userCreated: {
                        id_user: result.InsertID,
                        email: req.body.email
                    }
                }
            ) 
            return res.status(201).send(response);
        });
    });
})

module.exports = router;