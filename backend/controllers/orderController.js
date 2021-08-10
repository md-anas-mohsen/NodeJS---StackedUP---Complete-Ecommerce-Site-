const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const { orderItems,
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id    
    });

    res.status(200);
    res.json({
        success: true,
        order
    });
});

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({user: req.user.id});

    res.status(200).json({
        success: true,
        orders
    });
});

exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    });
});

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Order has been already delivered", 400));
    }

    if(order.orderStatus === "Processing" && req.body.orderStatus !== "In Transit") {
        return next(new ErrorHandler("Order needs to be dispatched", 400));
    }

    if(order.orderStatus === "In Transit" && req.body.orderStatus !== "Delivered") {
        return next(new ErrorHandler("Order is already in transit", 400));
    }

    if (order.orderStatus === "In Transit") {
        order.orderItems.forEach(async (item) => {
            await updateStock(item.productID, item.quantity)
        });
    }
    
    order.orderStatus = req.body.orderStatus;
    if (req.body.orderStatus === "Delivered") {
        order.deliveredOn = Date.now();
    }
    await order.save();
    res.status(200).json({
        success: true
    });
});

const updateStock = async (id, quantity) => {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({validateBeforeSave: false});
}

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler("No Order found with this ID", 404));
    }

    if(order.orderStatus !== "Delivered") {
        return next(new ErrorHandler("Only delivered orders may be deleted", 400));
    }

    await order.delete();

    res.status(200).json({
        success: true
    });
});