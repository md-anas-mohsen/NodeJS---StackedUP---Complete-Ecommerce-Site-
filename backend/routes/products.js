const express = require('express');
const router = express.Router();

const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth');

const { getProducts, 
        getProduct, 
        updateProduct, 
        deleteProduct, 
        newProduct,
        createProductReview,
        getProductReviews,
        deleteReview, 
        getAllProducts} = require('../controllers/productController');

router.get('/products', getProducts);
router.get('/products/:id', getProduct);

router.get('/admin/products/', isAuthenticatedUser, authorizedRoles("admin"), getAllProducts);
router.put('/admin/products/:id', isAuthenticatedUser, authorizedRoles("admin"), updateProduct);
router.delete('/admin/products/:id', isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);
router.post('/admin/products/', isAuthenticatedUser, authorizedRoles("admin"), newProduct);

router.post('/products/:id', isAuthenticatedUser, createProductReview);
router.get('/reviews', isAuthenticatedUser, getProductReviews);
router.delete('/reviews', isAuthenticatedUser, deleteReview);

module.exports = router;