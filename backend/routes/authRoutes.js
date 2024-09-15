const express = require('express');
const router = express.Router();
const { register, login, getUserProfile, getAllUsers, updateUserProfile, changePassword, deleteUser } = require('../controllers/authController');
const { protect, admin} = require('../middleware/authMiddleware');
const upload = require('../middleware/multer.js')

// Public routes for login and register
router.post('/register', upload.single("avatar"), register);
router.post('/login', login);

// Protected routes
// show the profile to user
router.get('/profile', protect, getUserProfile);

// update the user profile
router.put('/profile', protect, updateUserProfile);

// update the user profile
router.put('/changePassword', protect, changePassword);

// delete the user account
router.delete('/deleteAccount', protect, deleteUser);

// show all the users to admin
router.get('/allUsers', protect, admin, getAllUsers);

module.exports = router;

