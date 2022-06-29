const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');
const { response } = require('express');

router.post('/signup', (req, res, next) => {
    console.log(bcrypt)
    mysql.query(`SELECT * FROM users WHERE email = ?`, [req.body.email], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length > 0) {
            return res.status(400).send({ error: 'Já possui um usuário com este E-mail.' });
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).send(err);
            }
            const query = `INSERT INTO users (email, password) VALUES (?,?)`;
            const values = [req.body.email, hash];
            mysql.query(query, values, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(201).send({ message: 'Usuário Criado com sucesso!' });
            });
        });
    });
})

module.exports = router;