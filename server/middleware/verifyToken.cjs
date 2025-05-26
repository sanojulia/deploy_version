// Import required packages
const jwt = require('jsonwebtoken'); // For JWT verification
const dotenv = require('dotenv');   // For environment variables

// Load environment variables from .env file
dotenv.config();

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Adds user data to request object if token is valid
 */
const auth = (req, res, next) => {
     // Extract token from Authorization header (Bearer token format)
     const token = req.header('Authorization')?.split(' ')[1];
     // Return 401 if no token is provided
     if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

     try {
         // Verify token with secret key from environment variables
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         // Attach decoded user data to request object
         req.user = decoded;
         // Proceed to the next middleware or route handler
         next();
     } catch (error) {
         // Return 400 if token is invalid or expired
         res.status(400).json({ error: 'Invalid Token' });
     }
};

module.exports = auth;

