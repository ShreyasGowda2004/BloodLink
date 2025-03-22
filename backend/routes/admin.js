const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token for admin routes
const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bloodlinksecret');
    
    // Find admin by id
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// @route   POST /api/admin/register
// @desc    Register a new admin
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists with this email' });
    }
    
    // Create new admin
    const admin = new Admin({
      email,
      password,
      name
    });
    
    await admin.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'bloodlinksecret',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin by email
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email address' });
    }
    
    // Validate password
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'bloodlinksecret',
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Get donors count
    const donorsCount = await Donor.countDocuments();
    
    // Get blood requests statistics
    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({ 
      donorRequests: { $elemMatch: { status: 'pending' } } 
    });
    const fulfilledRequests = await BloodRequest.countDocuments({ 
      donorRequests: { $elemMatch: { status: { $in: ['accepted', 'donated'] } } }
    });
    const expiredRequests = await BloodRequest.countDocuments({ 
      donorRequests: { $elemMatch: { status: 'expired' } }
    });
    const rejectedRequests = await BloodRequest.countDocuments({ 
      donorRequests: { $elemMatch: { status: 'rejected' } }
    });
    
    // Get donation statistics
    const acceptedDonations = await BloodRequest.aggregate([
      { $unwind: '$donorRequests' },
      { $match: { 'donorRequests.status': 'accepted' } },
      { $count: 'total' }
    ]);
    
    const completedDonations = await BloodRequest.aggregate([
      { $unwind: '$donorRequests' },
      { $match: { 'donorRequests.status': 'donated' } },
      { $count: 'total' }
    ]);
    
    // Blood type distribution
    const bloodTypeDistribution = await Donor.aggregate([
      { $group: { _id: '$bloodType', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      donors: {
        total: donorsCount,
        bloodTypeDistribution
      },
      requests: {
        total: totalRequests,
        pending: pendingRequests,
        fulfilled: fulfilledRequests,
        expired: expiredRequests,
        rejected: rejectedRequests
      },
      donations: {
        accepted: acceptedDonations[0]?.total || 0,
        completed: completedDonations[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/admin/donors
// @desc    Get all donors
// @access  Private (Admin only)
router.get('/donors', authenticateAdmin, async (req, res) => {
  try {
    const donors = await Donor.find()
      .select('-password')
      .select('name phone bloodType city state country location createdAt updatedAt donationCount');
    res.status(200).json(donors);
  } catch (error) {
    console.error('Get donors error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/admin/requests
// @desc    Get all blood requests with detailed information
// @access  Private (Admin only)
router.get('/requests', authenticateAdmin, async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find()
      .populate({
        path: 'donorRequests.donor',
        select: 'name phone bloodType',
        strictPopulate: false
      })
      .sort({ createdAt: -1 });
      
    res.status(200).json(bloodRequests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 