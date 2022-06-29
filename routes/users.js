const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { response } = require('express');

router.post('/signup', (req, res, next) => {
    mysql.query("SELECT * FROM users WHERE email = (?)", [req.body.email], (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (result.length > 0) {
            return res.status(400).send({ error: 'Usuário já cadastrado!' });
        }
        bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (error) {
                return res.status(500).send(error);
            }
            const query = "INSERT INTO users (email, password) VALUES (?,?)";
            const values = [req.body.email, hash];
            mysql.query(query, values, (error, result) => {
                if (error) {
                    return res.status(500).send(error);
                }
                return res.status(201).send({ message: 'Usuário criado com sucesso!' });
            });
        });
    });
})

router.post('/signin', (req, res, next) => {
    mysql.query("SELECT * FROM users WHERE email = (?)",
        [req.body.email], (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (result.length == 0) {
            return res.status(401).send({ error: 'Falha na autenticação' })
        }
        bcrypt.compare(req.body.password, result[0].password,
             (error, result) => {
            if (error) {return res.status(401).send({ message: 'Falha na autenticação'})
        }
            if (result) {
                
                const token = jwt.sign({ 
                    id_user: result[0].id_user,
                    email: req.body.email,
                },
                
                secretOrKey = process.env.JWT_KEY, 
                { expiresIn: "1h" }
                );
                return res.status(200).send({
                    message: 'Usuário autenticado com sucesso!',
                    token: token
                });
            }
            return res.status(401).send({ error: 'Falha na autenticação' });
        });
    });
})

module.exports = router;