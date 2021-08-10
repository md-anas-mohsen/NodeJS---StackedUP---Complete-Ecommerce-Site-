const app = require('./app');
// const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cloudinary = require('cloudinary');

process.on("uncaughtException", err => {
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down server due to unhandled exception`);
    process.exit(1);
});

if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').dotenv.config({path: "backend/config/config.env"});
}

connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
});

process.on("unhandledRejection", err => {
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down server due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});