const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, no token provided'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get donor from token
      const donor = await Donor.findById(decoded.id).select('-password');

      if (!donor) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized, donor not found'
        });
      }

      // Add donor to request object
      req.donor = donor;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error in authentication'
    });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.donor && req.donor.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Not authorized as admin'
    });
  }
};

module.exports = { protect, admin }; 