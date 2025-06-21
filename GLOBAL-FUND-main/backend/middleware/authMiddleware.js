const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Path to your User model

// Middleware to protect routes (ensure user is logged in)
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer TOKEN_STRING")
      token = req.headers.authorization.split(' ')[1];

      // Verify token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the decoded token payload
      // Select '-password' to exclude the password hash from the user object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        // If user not found (e.g., user was deleted)
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error(error);
      // If token verification fails (e.g., expired, invalid signature)
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found in the header
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to authorize admin users only
const authorizeAdmin = (req, res, next) => {
  // Check if req.user exists (from the 'protect' middleware) and if they are an admin
  if (req.user && req.user.isAdmin) {
    next(); // Proceed if user is an admin
  } else {
    // If not authorized as admin
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, authorizeAdmin };
