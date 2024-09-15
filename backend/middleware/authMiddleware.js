const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = (req, res, next) => {
    // Check if the 'Authorization' header is present and correctly formatted
    const authHeader = req.header('Authorization');
    
    // Validate if the header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract the token from the header
    const token = authHeader.replace('Bearer ', '');

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;  // Attach the decoded token payload to the request object
        console.log(decoded);
        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(401).json({ message: 'Login is required...' });
    }
};

exports.admin = async (req, res, next) => {
    try {
        // Ensure `req.user` is set by a previous middleware (e.g., `protect` middleware)
        const user = await User.findById(req.user.id);
        console.log(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // If the user is an admin, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in admin middleware:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
