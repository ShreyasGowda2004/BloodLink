const Donor = require('../models/Donor');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all donors
exports.getDonors = async (req, res) => {
  try {
    console.log('GET /donors request received with query:', req.query);
    
    // Build filter - ONLY filter by blood type if provided
    const filter = {};
    if (req.query.bloodType) {
      filter.bloodType = req.query.bloodType;
      console.log(`Filtering donors by blood type: ${req.query.bloodType}`);
    }
    
    console.log('MongoDB filter:', filter);
    
    // Find donors with the specified blood type
    const donors = await Donor.find(filter);
    console.log(`Found ${donors.length} donors matching filter`);
    
    if (donors.length > 0) {
      console.log('Sample donor:', donors[0]);
    }
    
    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get donor by ID
exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new donor
// @route   POST /api/donors/register
// @access  Public
const registerDonor = async (req, res) => {
  try {
    const { name, email, phone, password, bloodType, location } = req.body;

    // Check if donor already exists
    const donorExists = await Donor.findOne({ phone });
    if (donorExists) {
      return res.status(400).json({
        success: false,
        error: 'Donor already exists with this phone number'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create donor
    const donor = await Donor.create({
      name,
      email,
      phone,
      password: hashedPassword,
      bloodType,
      location
    });

    if (donor) {
      res.status(201).json({
        success: true,
        data: {
          _id: donor._id,
          name: donor.name,
          email: donor.email,
          phone: donor.phone,
          bloodType: donor.bloodType,
          location: donor.location,
          token: generateToken(donor._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid donor data'
      });
    }
  } catch (error) {
    console.error('Register donor error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in registration'
    });
  }
};

// @desc    Login donor
// @route   POST /api/donors/login
// @access  Public
const loginDonor = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check for donor
    const donor = await Donor.findOne({ phone });
    if (!donor) {
      return res.status(401).json({
        success: false,
        error: 'Invalid phone number or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid phone number or password'
      });
    }

    res.json({
      success: true,
      data: {
        _id: donor._id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        bloodType: donor.bloodType,
        location: donor.location,
        token: generateToken(donor._id)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in login'
    });
  }
};

// @desc    Get donor profile
// @route   GET /api/donors/profile
// @access  Private
const getDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findById(req.donor._id).select('-password');
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    res.json({
      success: true,
      data: donor
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in getting profile'
    });
  }
};

// @desc    Update donor profile
// @route   PUT /api/donors/profile
// @access  Private
const updateDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findById(req.donor._id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }

    donor.name = req.body.name || donor.name;
    donor.email = req.body.email || donor.email;
    donor.bloodType = req.body.bloodType || donor.bloodType;
    donor.location = req.body.location || donor.location;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      donor.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedDonor = await donor.save();

    res.json({
      success: true,
      data: {
        _id: updatedDonor._id,
        name: updatedDonor.name,
        email: updatedDonor.email,
        phone: updatedDonor.phone,
        bloodType: updatedDonor.bloodType,
        location: updatedDonor.location,
        token: generateToken(updatedDonor._id)
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in updating profile'
    });
  }
};

// @desc    Get all donors
// @route   GET /api/donors
// @access  Private/Admin
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find({}).select('-password');
    res.json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    console.error('Get all donors error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in getting donors'
    });
  }
};

// @desc    Get nearby donors
// @route   GET /api/donors/nearby
// @access  Public
const getNearbyDonors = async (req, res) => {
  try {
    const { bloodType, location, radius = 10 } = req.query;
    
    // Basic query
    let query = {};
    
    // Add blood type filter if provided
    if (bloodType) {
      query.bloodType = bloodType;
    }
    
    // Add location filter if provided
    if (location) {
      // TODO: Implement location-based filtering
      // This is a placeholder for actual location-based query
      query.location = { $exists: true };
    }
    
    const donors = await Donor.find(query).select('-password');
    
    res.json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    console.error('Get nearby donors error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in getting nearby donors'
    });
  }
};

// @desc    Get donor donations
// @route   GET /api/donors/donations
// @access  Private
const getDonorDonations = async (req, res) => {
  try {
    const donor = await Donor.findById(req.donor._id).populate('donations');
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    res.json({
      success: true,
      data: donor.donations
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in getting donations'
    });
  }
};

// @desc    Add donation
// @route   POST /api/donors/donations
// @access  Private
const addDonation = async (req, res) => {
  try {
    const donor = await Donor.findById(req.donor._id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }

    const donation = {
      date: req.body.date,
      location: req.body.location,
      notes: req.body.notes
    };

    donor.donations.push(donation);
    await donor.save();

    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Add donation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in adding donation'
    });
  }
};

// @desc    Get donor requests
// @route   GET /api/donors/:donorId/requests
// @access  Private
const getDonorRequests = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.donorId).populate('requests');
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    res.json({
      success: true,
      data: donor.requests
    });
  } catch (error) {
    console.error('Get donor requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in getting donor requests'
    });
  }
};

// @desc    Update request status
// @route   PUT /api/donors/:donorId/requests/:requestId/:status
// @access  Private
const updateRequestStatus = async (req, res) => {
  try {
    const { donorId, requestId, status } = req.params;
    
    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be either accepted or rejected'
      });
    }

    // TODO: Implement request status update logic
    // This is a placeholder for actual implementation
    
    res.json({
      success: true,
      message: `Request ${status} successfully`
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error in updating request status'
    });
  }
};

// Update donor
exports.updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Delete donor
exports.deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get donors by blood type
exports.getDonorsByBloodType = async (req, res) => {
  try {
    const donors = await Donor.find({ 
      bloodType: req.params.bloodType,
      isAvailable: true 
    });
    
    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get nearby donors
exports.getNearbyDonors = async (req, res) => {
  try {
    const { lat, lng, distance } = req.params;
    
    // Convert string parameters to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const maxDistance = parseFloat(distance) || 10; // Default to 10km
    
    // Validate parameters
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude or longitude'
      });
    }
    
    // Find donors near the specified location
    const donors = await Donor.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance * 1000 // Convert km to meters
        }
      },
      isAvailable: true
    });
    
    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    console.error('Error fetching nearby donors:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

module.exports = {
  registerDonor,
  loginDonor,
  getDonorProfile,
  updateDonorProfile,
  getAllDonors,
  getNearbyDonors,
  getDonorDonations,
  addDonation,
  getDonorRequests,
  updateRequestStatus
};
