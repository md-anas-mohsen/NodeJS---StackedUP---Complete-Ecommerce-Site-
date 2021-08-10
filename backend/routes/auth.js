const router = require('express').Router();
const { 
        registerUser, 
        loginUser,
        logoutUser,
        forgotPassword,
        resetPassword,
        getUserProfile,
        updatePassword,
        updateProfile,
        allUsers,
        getUserDetails,
        updateUser,
        deleteUser, 
        getUserNamePic} = require('../controllers/authController');

const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/password/reset', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.put('/password/update', isAuthenticatedUser, updatePassword);

router.delete('/logout', logoutUser);

router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/me/update', isAuthenticatedUser, updateProfile);

router.get('/frontend/user/:id', getUserNamePic);

router.get('/admin/users', isAuthenticatedUser, authorizedRoles("admin"), allUsers);
router.get('/admin/user/:id', isAuthenticatedUser, authorizedRoles("admin"), getUserDetails);
router.put('/admin/user/:id', isAuthenticatedUser, authorizedRoles("admin"), updateUser);
router.delete('/admin/user/:id', isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

module.exports = router;