const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [100, "Product name must within 100 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        maxLength: [6, "Product price must be within 6 figures"],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please select category for this product"],
        values: [
            "Electronics",
            "Cameras",
            "Computers",
            "Phones",
            "Consoles",
            "Accessories",
            "Books",
            "Apparel",
            "Footwear",
            "Sports",
            "Home"
        ],
        message: "Please select valid category"
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxLength: [5, "Product stock must be within 5 figures"],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'User',
                required: true  
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: [0, "Rating must be between 1 to 5"],
                max: [5, "Rating must be between 1 to 5"]
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true  
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Product", productSchema);