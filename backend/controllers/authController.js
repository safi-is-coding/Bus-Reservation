const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uploadOnCloudinary = require('../utils/cloudinary.js');
const User = require('../models/User');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name){
            return res.status(400).json({ message: 'Please enter your name' });
        }
        if(!email){
            return res.status(400).json({message: 'Please enter your email'})
        }
        if(!password){
            return res.status(400).json({message: 'Please enter your password'})

        }

        let avatar;

        // Check if the file is attached
        if (req.file) {
            avatar = req.file.path; // Assuming multer provides the file path
            console.log("avatar file path -> " + avatar);
        }

        // Upload the avatar to Cloudinary only if it's a file path, not a default URL
        if (req.file) {
            try {
                avatar = await uploadOnCloudinary(avatar);
            } catch (error) {
                return res.status(500).json({ message: 'Failed to upload avatar' });
            }
        }

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            avatar, // URL from Cloudinary or default
            name,
            email,
            password: hashedPassword
        });

        // Save user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error while registering' });
    }
};



// Backend login route
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_KEY , { expiresIn: '1h' });
        console.log(user._id);
        res.status(200).json({ message: 'Login successful', token, isAdmin: user.isAdmin, userId: user._id});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error while login' });
    }
};


// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        // Retrieve user from database using ID from token
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error wile getting user profile' });
    }
};

// Get all the Users
exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }catch (error) {
        res.status(500).json({ message: 'Server error while getting all the users...' });
    }
}

// Update the user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const id = await User.findById(req.user.id);
        const { name, email } = req.body;

        if (!id) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = await User.findByIdAndUpdate(id, {
            name,
            email
        }, { new: true });
        
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });

    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Server error while updating user profile...' });
    }
}

// Change the password of the user
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error while changing password' });
    }
};

//delete the user account
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
            
        res.status(200).json({ message: 'User deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting user:', error);
                
        res.status(500).json({ message: 'Server error while deleting user' });
        
    }
    
}

