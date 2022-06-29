const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routeProducts = require('./routes/products');
const routeRequests = require('./routes/requests');
const routeCategories = require('./routes/categories');
const routeClients = require('./routes/clients');
const routeUsers = require('./routes/users');
const res = require('express/lib/response');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false })); // BodyParser Apenas JSON de entrada no Body
app.use(bodyParser.json()); // BodyParser Apenas JSON de entrada no Body

app.use((req, res, next) => { 
    res.header('Access-Control-Allow-Origin','*')
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/products', routeProducts);
app.use('/requests', routeRequests);
app.use('/categories', routeCategories);
app.use('/clients', routeClients);
app.use('/users', routeUsers);

// Quando não encontrar a route. Retorna:
app.use((req, res, next) =>{
    const error = new Error('Não encontrado :(');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        error: {
            message: error.message
        }
    });
});

module.exports = app;