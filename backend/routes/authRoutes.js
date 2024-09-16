const express = require('express');
const router = express.Router();
const { register, login, getUserProfile, getAllUsers, updateUserProfile, changePassword, deleteUser, deleteAccount, makeAdmin, removeAdmin } = require('../controllers/authController');
const { protect, admin} = require('../middleware/authMiddleware');
const upload = require('../middleware/multer.js')

// Public routes for login and register
router.post('/register', upload.single("avatar"), register);
router.post('/login', login);

// Protected routes
// show the profile to user
router.get('/profile', protect, getUserProfile);

// update the user profile
router.put('/updateProfile', protect, updateUserProfile);

// update the user profile
router.put('/changePassword', protect, changePassword);

// delete the user account (by the user)
router.delete('/deleteAccount', protect, deleteAccount);

// delete the user account (by the admin)
router.delete('/deleteUser/:id', protect, admin, deleteUser);

// make user as admin
router.put('/makeAdmin/:id', protect, admin, makeAdmin);

// remove user as admin
router.put('/removeAdmin/:id', protect, admin, removeAdmin);


// show all the users to admin
router.get('/allUsers', protect, admin, getAllUsers);

module.exports = router;

