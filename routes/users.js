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
        if (result.length <1) {
            return res.status(400).send({ error: 'Falha na autenticação! Tente novamente'})
        }
        const token = jwt.sign({
            email: result[0].email}, 
            process.env.JWT_KEY,
            {expiresIn: '1h'
        });
        if (error) {return res.status(500).send(error);}
        bcrypt.compare(req.body.password, result[0].password, (error, result) => {
            if (error) {
                return res.status(500).send(error);
            }
            if (!result) {
                return res.status(400).send({ error: 'Falha na autenticação! Tente novamente' });
            }
            return res.status(200).send({ 
                message: 'Autenticado com sucesso!', 
                token: token });
        });
    });
})

module.exports = router;