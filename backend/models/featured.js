const mongoose = require('mongoose');

const featuredSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter title"],
        trim: true,
        maxLength: [50, "Title must within 50 characters"]
    },
    description: {
        type: String,
        required: [true, "Please enter description"],
        trim: true,
        maxLength: [300, "Description must within 300 characters"]
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    link: {
        type: String,
        required: [true, "Please enter link"],
        trim: true,
    },
});

module.exports = mongoose.model("Featured", featuredSchema, "featured");