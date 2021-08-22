const express = require('express');
const helmet = require('helmet');
const app = express();

const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

const products = require('./routes/products');
const auth = require('./routes/auth');
const orders = require('./routes/orders');
const payment = require('./routes/payment');

const errorMiddleware = require('./middlewares/errors');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(fileUpload());

app.use(helmet({
    hidePoweredBy: { setTo: 'PHP/7.3.11' },
    contentSecurityPolicy: {
    directives: {
        defaultSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
        styleSrc: ["'self'", 'https://fonts.googleapis.com', 'https://use.fontawesome.com'],
     }
    },
    dnsPrefetchControl: false
}));

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', orders);
app.use('/api/v1', payment);

if(process.env.NODE_ENV === 'PRODUCTION') {
    app.use('/', express.static(path.join(__dirname, '../frontend/build')));
    app.use('/admin', express.static(path.join(__dirname, '../admin/build')));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
    app.get('/admin/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../admin/build', 'index.html'));
    });
}

app.use(errorMiddleware);

module.exports = app;