const express = require('express');
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

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', orders);
app.use('/api/v1', payment);

if(process.env.NODE_ENV === 'PRODUCTION') {
    app.use('/', express.static(path.join(process.cwd(), '../frontend/build')));
    app.use('/admin', express.static(path.join(process.cwd(), '../admin/build')));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(process.cwd(), '../frontend/build', 'index.html'));
    });
    app.get('/admin/*', function (req, res) {
        res.sendFile(path.join(process.cwd(), '../admin/build', 'index.html'));
    });
}

app.use(errorMiddleware);

module.exports = app;