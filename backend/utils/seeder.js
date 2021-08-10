const Product = require('../models/product');
// const dotenv = require('dotenv');
const connectDB = require('../config/database');

const products = require('../data/product.json');
const {connect} = require('mongoose');

if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').dotenv.config({path: "backend/config/config.env"});
}

const seedProducts = async () => {
    try {
        await Product.deleteMany();
        console.log("All products are deleted");

        await Product.insertMany(products);
        console.log("All products are added");

        process.exit();
    } catch(error) {
        console.log(error.message);
        process.exit();
    }
}

connectDB();
seedProducts();