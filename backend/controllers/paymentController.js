const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
// const dotenv = require('dotenv');

if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').dotenv.config({path: "backend/config/config.env"});
}

if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').dotenv.config({path: "backend/config/config.env"});
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' }
    });
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    });
});

exports.sendStripeApi = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    });
});
