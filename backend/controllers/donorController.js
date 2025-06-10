const Donor = require('../models/Donor');
const mongoose = require('mongoose');

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

// Create a new donor
exports.createDonor = async (req, res) => {
  try {
    console.log('Creating donor with data:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const requiredFields = ['name', 'age', 'gender', 'bloodType', 'phone', 'country', 'state', 'city', 'smoking', 'drinking', 'lastDonation', 'password'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if phone number already exists
    const existingDonor = await Donor.findOne({ phone: req.body.phone });
    if (existingDonor) {
      return res.status(400).json({
        success: false,
        error: 'Phone number already registered. Please use a different phone number or login to your account.'
      });
    }
    
    // Convert string age to number if needed
    if (typeof req.body.age === 'string') {
      req.body.age = parseInt(req.body.age, 10);
    }
    
    // Validate age
    const age = req.body.age;
    if (isNaN(age) || age < 18 || age > 65) {
      console.error('Invalid age:', age);
      return res.status(400).json({
        success: false,
        error: 'Age must be between 18 and 65'
      });
    }
    
    // Validate phone number
    const { phone } = req.body;
    if (!/^\d{10}$/.test(phone)) {
      console.error('Invalid phone number:', phone);
      return res.status(400).json({
        success: false,
        error: 'Phone number must be 10 digits'
      });
    }
    
    // Validate password
    if (req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }
    
    // Validate blood type
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(req.body.bloodType)) {
      console.error('Invalid blood type:', req.body.bloodType);
      return res.status(400).json({
        success: false,
        error: 'Invalid blood type'
      });
    }
    
    // Validate gender
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(req.body.gender)) {
      console.error('Invalid gender:', req.body.gender);
      return res.status(400).json({
        success: false,
        error: 'Invalid gender'
      });
    }
    
    // Validate smoking and drinking
    const validOptions = ['yes', 'no'];
    if (!validOptions.includes(req.body.smoking)) {
      console.error('Invalid smoking status:', req.body.smoking);
      return res.status(400).json({
        success: false,
        error: 'Invalid smoking status'
      });
    }
    if (!validOptions.includes(req.body.drinking)) {
      console.error('Invalid drinking status:', req.body.drinking);
      return res.status(400).json({
        success: false,
        error: 'Invalid drinking status'
      });
    }
    
    // Validate lastDonation
    const validLastDonation = ['never', 'less_than_3_months', 'more_than_3_months'];
    if (!validLastDonation.includes(req.body.lastDonation)) {
      console.error('Invalid lastDonation value:', req.body.lastDonation);
      return res.status(400).json({
        success: false,
        error: 'Invalid lastDonation value'
      });
    }
    
    // Create donor with sanitized data
    const donorData = {
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      bloodType: req.body.bloodType,
      phone: req.body.phone,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      smoking: req.body.smoking,
      drinking: req.body.drinking,
      lastDonation: req.body.lastDonation,
      password: req.body.password // Will be hashed by pre-save hook
    };
    
    console.log('Creating donor with sanitized data (password field will be hashed)');
    
    // Check if the Donor model exists
    console.log('Donor model type:', typeof Donor);
    console.log('Is Donor defined?', !!Donor);
    
    // Check MongoDB connection
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    try {
      const donor = await Donor.create(donorData);
      
      // Send confirmation SMS in a real application
      console.log(`Sending confirmation SMS to ${phone}: Thank you for registering as a blood donor. Your generosity can save lives.`);
      
      // Remove password from response
      const donorResponse = donor.toObject();
      delete donorResponse.password;
      
      console.log('Donor created successfully');
      return res.status(201).json({
        success: true,
        data: donorResponse
      });
    } catch (mongoError) {
      console.error('MongoDB operation error:', mongoError);
      console.error('Error name:', mongoError.name);
      console.error('Error message:', mongoError.message);
      console.error('Error code:', mongoError.code);
      
      // Check for duplicate key error
      if (mongoError.code === 11000) {
        return res.status(400).json({
          success: false,
          error: 'Phone number already registered'
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Database operation failed: ' + mongoError.message
      });
    }
  } catch (error) {
    console.error('Error creating donor:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      console.error('Validation error messages:', messages);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error('Server error details:', error.message);
      console.error('Error stack:', error.stack);
      return res.status(500).json({
        success: false,
        error: 'Server Error: ' + error.message
      });
    }
  }
};

// Login donor
exports.loginDonor = async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Validate inputs
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide phone number and password'
      });
    }
    
    // Check if donor exists
    const donor = await Donor.findOne({ phone }).select('+password');
    
    if (!donor) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await donor.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Return donor data without password
    const donorData = donor.toObject();
    delete donorData.password;
    
    res.status(200).json({
      success: true,
      data: donorData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get donor's blood requests
exports.getDonorRequests = async (req, res) => {
  try {
    const donorId = req.params.id;
    
    const donor = await Donor.findById(donorId)
      .populate({
        path: 'bloodRequests.requestId',
        model: 'BloodRequest'
      });
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: donor.bloodRequests
    });
  } catch (error) {
    console.error('Error fetching donor requests:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update request status (accept/reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { donorId, requestId, status } = req.params;
    
    console.log(`Updating request status: donorId=${donorId}, requestId=${requestId}, status=${status}`);
    
    if (!['accepted', 'rejected', 'donated'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "accepted", "rejected", or "donated"'
      });
    }
    
    // Find the donor
    const donor = await Donor.findById(donorId);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    
    // Find the request in the donor's bloodRequests array
    const requestIndex = donor.bloodRequests.findIndex(
      req => req.requestId.toString() === requestId
    );
    
    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Blood request not found in donor\'s requests'
      });
    }
    
    // Update the status in the donor's bloodRequests
    donor.bloodRequests[requestIndex].status = status;
    donor.bloodRequests[requestIndex].updatedAt = new Date();
    
    // If status is 'donated', update donation count and last donation date
    if (status === 'donated') {
      // Update donation history
      donor.donationCount = (donor.donationCount || 0) + 1;
      donor.lastDonation = 'less_than_3_months';  // Update the lastDonation field to match the schema enum
      console.log(`Updating donor ${donorId} donation count to ${donor.donationCount}`);
    }
    
    await donor.save();
    
    // Now also update the status in the blood request's donorRequests
    const BloodRequest = require('../models/BloodRequest');
    const bloodRequest = await BloodRequest.findById(requestId);
    
    if (bloodRequest) {
      const donorRequestIndex = bloodRequest.donorRequests.findIndex(
        dr => dr.donor && dr.donor.toString() === donorId
      );
      
      if (donorRequestIndex !== -1) {
        bloodRequest.donorRequests[donorRequestIndex].status = status;
        bloodRequest.donorRequests[donorRequestIndex].updatedAt = new Date();
        
        // If donated, update the blood request's overall status to fulfilled
        if (status === 'donated') {
          bloodRequest.overallStatus = 'fulfilled';
        }
        
        await bloodRequest.save();
        console.log(`Updated blood request ${requestId} with ${status} status for donor ${donorId}`);
      } else {
        console.log(`Warning: Donor ${donorId} not found in blood request ${requestId}`);
      }
    } else {
      console.log(`Warning: Blood request ${requestId} not found when updating status`);
    }
    
    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      data: donor.bloodRequests[requestIndex]
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
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
