const Product = require('../models/product');
const Featured = require('../models/featured');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];
    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    let imageLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });
        imageLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        });
    }
    req.body.images = imageLinks;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    });
});

exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const resultsPerPage = 8;
    // const productCount = await Product.countDocuments(); 
    let apiFeatures = new APIFeatures(Product.find(), req.query)
                        .search()
                        .filter();
    
    const productCount = await apiFeatures.query.countDocuments();
    apiFeatures = new APIFeatures(Product.find(), req.query)
                        .search()
                        .filter()
                        .pagination(resultsPerPage);
    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        productCount: productCount,
        resPerPage: resultsPerPage,
        products
    });
});

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    });
});

exports.getProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        next(new ErrorHandler("Product not found", 404));
    } else {
        res.status(200).json({
            success: true,
            product
        });
    }
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    let images = [];
    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    
    if (images !== undefined) {
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
        let imageLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });
            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }
        req.body.images = imageLinks;
    }
    req.body.user = req.user._id;
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true, useFindAndModify: false});
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product
    });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const {rating, comment} = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        comment,
        rating
    }

    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product.reviews.find(
        review => review.user.toString() === req.user.id.toString()
    );

    if(isReviewed) {
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating+acc, 0)/product.reviews.length;
    
    await product.save({ validateBeforeSave: false });
    
    res.status(200).json({
        success: true
    });
});

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.reviewId.toString());
    const numOfReviews = reviews.length;
    const ratings = reviews.reduce((acc, item) => acc + item.rating, 0)/numOfReviews || 0;
    
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    
    res.status(200).json({
        success: true
    });
});

exports.getFeatured = catchAsyncErrors(async (req, res, next) => {
    const featured = await Featured.find();

    res.status(200).json({
        featured: featured
    });
});

exports.newFeatured = catchAsyncErrors(async (req, res, next) => {
    let image = "";
    if (typeof req.body.image === 'string') {
        image = req.body.image;
    }
    
    let imageLink = "";
    const result = await cloudinary.v2.uploader.upload(image, { folder: 'featured' });
    imageLink = {
        public_id: result.public_id,
        url: result.secure_url
    };
    req.body.image = imageLink;
    
    const featuredSlide = await Featured.create(req.body);
    res.status(200).json({
        success: true,
        featured: featuredSlide
    });
});

exports.deleteFeatured = catchAsyncErrors(async (req, res, next) => {
    let featuredSlide = await Featured.findById(req.params.id);
    if (!featuredSlide) {
        return next(new ErrorHandler("Featured slide not found", 404));
    }
    
    const result = await cloudinary.v2.uploader.destroy(featuredSlide.image.public_id);

    await Featured.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Featured slide deleted successfully"
    });
});