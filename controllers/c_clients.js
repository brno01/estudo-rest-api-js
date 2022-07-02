const mysql = require('../database/mysql');

exports.getClients = async (req, res, next) => {
    try {
        const result = await mysql.execute('SELECT * FROM clients;')
        const response = {
            'quantity(all)': result.length,
            'Todos os clientes': result.map(client => {
                return {
                    id_client: client.id_client,
                    name: client.name,
                    email: client.email,
                    phone: client.phone,
                    create_time: client.create_time,
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de um cliente específico:',
                        url: process.env.URL_API + 'clients/' + client.id_client,
                    }
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send(error);
    }
};
//exports.getClients = (req, res, next) => {
//    mysql.query(
//        "SELECT * FROM clients;",
//        (error, result, fields) => {
//            if (error) {return res.status(500).send({ 
//                message: 'Erro ao listar todos os clientes!',
//                error : error 
//            })}
//            if (result.length == 0) {
//                return res.status(404).send({
//                    message: 'Não há clientes cadastrados! :('
//                })
//            }
//            const response = {
//                quantity: result.length,
//                clients: result.map(client => {
//                    return {
//                        id_client: client.id_client,
//                        name: client.name,
//                        email: client.email,
//                        phone: client.phone,
//                        create_time: client.create_time,
//                        request: {
//                            type: 'GET',
//                            description: 'Retorna os detalhes de um cliente específico:',
//                            url: process.env.URL_API + 'clients/' + client.id_client,
//                        }
//                    }
//                })
//            }
//        return res.status(200).send(response);
//        }
//    )
//};

exports.getClientsbyID = async (req, res, next) => {
    try {
        const result = await mysql.execute('SELECT * FROM clients WHERE id_client = ?;', [req.params.id_client]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado um cliente com esse ID'
            })
        }
        const response = {
                id_client: result[0].id_client,
                name: result[0].name,
                email: result[0].email,
                password: result[0].password,
                birthdate: result[0].birthdate,
                gender: result[0].gender,
                phone: result[0].phone,
                create_time: result[0].create_time,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os clientes:',
                    url: process.env.URL_API + 'clients/',
                }
            }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};
//exports.getClientsbyID = (req, res, next) => {
//    mysql.query(
//        'SELECT * FROM clients WHERE id_client = ?;',
//        [req.params.id_client],
//        (error, result, fields) => {
//            if (error) {return res.status(500).send({ 
//                message: 'Erro ao listar o cliente específico.',
//                error : error 
//            })}
//            if (result.length == 0) {
//                return res.status(404).send({
//                    message: 'Não foi encontrado um cliente com esse ID. :('
//                })
//            }
//            const response = {
//                client: {
//                    id_client: result[0].id_client,
//                    name: result[0].name,
//                    email: result[0].email,
//                    password: result[0].password,
//                    birthdate: result[0].birthdate,
//                    gender: result[0].gender,
//                    phone: result[0].phone,
//                    create_time: result[0].create_time,
//                    request: {
//                        type: 'GET',
//                        description: 'Retorna todos os clientes:',
//                        url: url: process.env.URL_API + 'clients/',
//                    }
//                }
//            }
//            return res.status(200).send(response);
//        }
//    )
//};

exports.postClient = async (req, res, next) => {
    try {
        const query = 'INSERT INTO clients (id_client, name, email, password, birthdate, gender, phone) VALUES (?,?,?,?,?,?,?)';
        const result = mysql.execute(query, [
            req.body.id_client, 
            req.body.name,
            req.body.email,
            req.body.password,
            req.body.birthdate,
            req.body.gender,
            req.body.phone
        ]);
        const response = {
            message: 'Cliente criado com sucesso! :)',
            clientCreated: {
                id_client: result.id_client,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                birthdate: req.body.birthdate,
                gender: req.body.gender,
                phone: req.body.phone,
                create_time: result.create_time,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os clientes:',
                    url: process.env.URL_API + 'clients/',
                }
            }
        };
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};
//exports.postClient = (req, res, next) => {
//    mysql.query(
//        'INSERT INTO clients (id_client, name, email, password, birthdate, gender, phone) VALUES (?,?,?,?,?,?,?)',
//        [
//            req.body.id_client, 
//            req.body.name,
//            req.body.email,
//            req.body.password,
//            req.body.birthdate,
//            req.body.gender,
//            req.body.phone
//        ],
//        (error, result, fields) => {
//            if (error) {return res.status(500).send({ 
//                message: 'Erro ao cadastrar o cliente, tente novamente!',
//                error : error 
//            })}
//            res.status(201).send({
//                message: 'Cliente criado com sucesso! :)',
//                clientCreated: {
//                    id_client: result.id_client,
//                    name: req.body.name,
//                    email: req.body.email,
//                    password: req.body.password,
//                    birthdate: req.body.birthdate,
//                    gender: req.body.gender,
//                    phone: req.body.phone,
//                    create_time: result.create_time,
//                    request: {
//                        type: 'GET',
//                        description: 'Retorna todos os clientes:',
//                        url: process.env.URL_API + 'clients/',
//                    }
//                }
//            });
//        }
//    )
//};

exports.patchClient = async (req, res, next) => {
    try {
        const result = await mysql.execute("UPDATE clients SET name = ?, email = ?, password = ?, birthdate = ?, gender = ?, create_time= ?, phone = ? WHERE id_client = '?' ",
        [
            req.body.name, 
            req.body.email,
            req.body.password,
            req.body.birthdate,
            req.body.gender,
            req.body.create_time,
            req.body.phone,
            req.body.id_client
        ]);
        const response = {
            message: 'Cliente alterado com sucesso! :)',
                clientUpdated: {
                id_client: req.body.id_client,
                name: req.body.name,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os dados deste cliente:',
                    url: process.env.URL_API + 'clients/' + client.id_client,
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};
//exports.patchClient = (req, res, next) => {
//    mysql.query(
//    "UPDATE clients SET name = ?, email = ?, password = ?, birthdate = ?, gender = ?, create_time= ?, phone = ? WHERE id_client = '?' ",
//    [
//        req.body.name, 
//        req.body.email,
//        req.body.password,
//        req.body.birthdate,
//        req.body.gender,
//        req.body.create_time,
//        req.body.phone,
//        req.body.id_client
//    ],
//        (error, result, fields) => {
//            if (error) {return res.status(500).send({ 
//                message: 'Erro ao alterar os dados deste cliente.',
//                error : error 
//            })}
//            if (result.length == 0) {
//                return res.status(404).send({
//                    message: 'Não foi encontrado um cliente com esse ID. :('
//                })
//            }
//            res.status(202).send({
//                message: 'Cliente alterado com sucesso! :)',
//                clientUpdated: {
//                    id_client: req.body.id_client,
//                    name: req.body.name,
//                    request: {
//                        type: 'GET',
//                        description: 'Retorna todos os dados deste cliente:',
//                        url: process.env.URL_API + 'clients/' + client.id_client,
//                    }
//                }
//            });
//        }
//    )
//};

exports.deleteClient = async (req, res, next) => {
    try {
        const result = await mysql.execute("DELETE FROM clients WHERE id_client = '?' ", [req.body.id_client]);
        const response = {
            message: 'Cliente deletado com sucesso! :)',
                clientDeleted: {
                id_client: req.body.id_client,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os clientes:',
                    url: process.env.URL_API + 'clients/',
                }
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({error: error});
    }
};
//exports.deleteClient = (req, res, next) => {
//    mysql.query(
//        "DELETE FROM clients WHERE id_client = ?",[req.body.id_client],
//        (error,result,fields) => {
//            if (error) {return res.status(500).send({ 
//                message: 'Erro ao deletar este cliente.',
//                error : error 
//            })}            const response = {
//                message: 'Cliente removido com sucesso!',
//                request: {
//                    type: 'POST',
//                    description: 'Insere um cliente:',
//                    url: process.env.URL_API + 'clients/',
//                } 
//            }
//            return res.status(202).send(response);
//        }
//    )
//};