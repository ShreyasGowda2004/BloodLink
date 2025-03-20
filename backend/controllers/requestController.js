const Request = require('../models/Request');
const Donor = require('../models/Donor');
const smsService = require('../services/smsService');
const BloodRequest = require('../models/BloodRequest');
const mongoose = require('mongoose');

// Get all requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get request by ID
exports.getRequestById = async (req, res) => {
  try {
    console.log(`Getting request with ID: ${req.params.id}`);
    const request = await Request.findById(req.params.id).populate('matchedDonors');
    
    if (!request) {
      console.log(`Request not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }
    
    console.log(`Request found: ${request._id}, matched donors: ${request.matchedDonors.length}`);
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error(`Error getting request by ID: ${req.params.id}`, error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// Create a new blood request
exports.createBloodRequest = async (req, res) => {
  try {
    console.log('Creating blood request with data:', req.body);
    
    // Validate required fields
    const requiredFields = ['name', 'bloodType', 'gender', 'phone', 'country', 'state', 'city'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Create the request in the database
    const request = await BloodRequest.create(req.body);
    
    console.log('Blood request created successfully:', request);
    
    // Return the created request object
    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error creating blood request:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all blood requests
exports.getBloodRequests = async (req, res) => {
  try {
    let filter = {};
    
    // Allow filtering by bloodType
    if (req.query.bloodType) {
      filter.bloodType = req.query.bloodType;
    }
    
    // Allow filtering by status
    if (req.query.status) {
      filter.overallStatus = req.query.status;
    }
    
    // Allow filtering by phone number (for requester to check status)
    if (req.query.phone) {
      filter.phone = req.query.phone;
    }
    
    console.log('Blood request filter:', filter);
    
    const requests = await BloodRequest.find(filter)
      .sort({ createdAt: -1 });  // Most recent first
    
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error getting blood requests:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single blood request
exports.getBloodRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate({
        path: 'donorRequests.donorId',
        select: 'name bloodType city state phone' // Only include necessary fields
      });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Blood request not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error getting blood request:', error);
    
    // Check if the ID format is invalid
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid blood request ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update request
exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: request
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

// Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
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

// Get matching donors for a request
exports.getMatchingDonors = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }
    
    // Find compatible blood types
    let compatibleTypes = [];
    switch(request.bloodType) {
      case 'A+':
        compatibleTypes = ['A+', 'A-', 'O+', 'O-'];
        break;
      case 'A-':
        compatibleTypes = ['A-', 'O-'];
        break;
      case 'B+':
        compatibleTypes = ['B+', 'B-', 'O+', 'O-'];
        break;
      case 'B-':
        compatibleTypes = ['B-', 'O-'];
        break;
      case 'AB+':
        compatibleTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        break;
      case 'AB-':
        compatibleTypes = ['A-', 'B-', 'AB-', 'O-'];
        break;
      case 'O+':
        compatibleTypes = ['O+', 'O-'];
        break;
      case 'O-':
        compatibleTypes = ['O-'];
        break;
    }
    
    // Find donors with compatible blood types
    const donors = await Donor.find({
      bloodType: { $in: compatibleTypes },
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

// Mark request as fulfilled
exports.fulfillRequest = async (req, res) => {
  try {
    const { donorId } = req.body;
    
    if (!donorId) {
      return res.status(400).json({
        success: false,
        error: 'Donor ID is required'
      });
    }
    
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }
    
    const donor = await Donor.findById(donorId);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        error: 'Donor not found'
      });
    }
    
    // Update request status
    request.status = 'fulfilled';
    request.matchedDonors.push(donorId);
    await request.save();
    
    // Update donor information
    donor.donationCount += 1;
    donor.lastDonation = Date.now();
    donor.isAvailable = false; // Temporarily unavailable after donation
    await donor.save();
    
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Send blood request to matching donors
exports.sendRequestToDonors = async (req, res) => {
  try {
    const requestId = req.params.id;
    
    // Find the blood request
    const bloodRequest = await BloodRequest.findById(requestId);
    
    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        error: 'Blood request not found'
      });
    }
    
    // Find matching donors
    const matchingDonors = await Donor.find({
      bloodType: bloodRequest.bloodType,
      isAvailable: true
    });
    
    if (matchingDonors.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No matching donors found'
      });
    }
    
    console.log(`Found ${matchingDonors.length} matching donors`);
    
    // Get list of donor IDs that have already been sent this request
    const existingDonorIds = bloodRequest.donorRequests.map(r => r.donorId.toString());
    
    // Filter out donors who have already been sent this request
    const newDonors = matchingDonors.filter(
      donor => !existingDonorIds.includes(donor._id.toString())
    );
    
    if (newDonors.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Request has already been sent to all matching donors'
      });
    }
    
    console.log(`Sending request to ${newDonors.length} new donors`);
    
    // Add the request to each donor's bloodRequests array
    const donorPromises = newDonors.map(async (donor) => {
      // Add to donor's blood requests
      donor.bloodRequests.push({
        requestId: bloodRequest._id,
        status: 'pending'
      });
      await donor.save();
      
      // Add to blood request's donor requests
      bloodRequest.donorRequests.push({
        donorId: donor._id,
        status: 'pending'
      });
    });
    
    // Wait for all updates to complete
    await Promise.all(donorPromises);
    
    // Save the blood request with new donors
    await bloodRequest.save();
    
    res.status(200).json({
      success: true,
      message: `Request sent to ${newDonors.length} donors`,
      data: {
        requestId: bloodRequest._id,
        donorsSentTo: newDonors.length
      }
    });
  } catch (error) {
    console.error('Error sending request to donors:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get blood request status for a requester
exports.getBloodRequestStatus = async (req, res) => {
  try {
    const { phone, bloodType } = req.query;
    
    console.log(`Looking for blood requests with: phone=${phone}, bloodType=${bloodType}`);
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required to check request status'
      });
    }
    
    // First, try to find any blood requests with this phone number
    const phoneRequests = await BloodRequest.find({ phone: phone.toString() });
    
    console.log(`Found ${phoneRequests.length} requests with phone ${phone}`);
    
    // If there are requests with this phone but none match the blood type, we'll use the first one
    let useRequests = [];
    
    if (bloodType) {
      // Try to find requests that match both phone and blood type
      useRequests = phoneRequests.filter(req => req.bloodType === bloodType);
      console.log(`Found ${useRequests.length} requests matching phone and blood type`);
    }
    
    // If no matches with blood type, just use all requests for this phone
    if (useRequests.length === 0) {
      useRequests = phoneRequests;
    }
    
    if (useRequests.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No blood requests found for this phone number'
      });
    }
    
    // Sort requests by most recent first
    useRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Populate the donor information for these requests
    const populatedRequests = [];
    
    for (const request of useRequests) {
      console.log(`Populating donor information for request ${request._id}`);
      const populatedRequest = await BloodRequest.findById(request._id)
        .populate({
          path: 'donorRequests.donorId',
          select: 'name bloodType city state phone'
        });
      
      if (populatedRequest) {
        populatedRequests.push(populatedRequest);
      }
    }
    
    // Format the response to focus on status information
    const formattedRequests = populatedRequests.map(request => {
      // Get all donors with their status
      const allDonors = request.donorRequests
        .map(dr => {
          if (dr.donorId) {
            return {
              _id: dr.donorId._id, // Include the donor ID
              name: dr.donorId.name || 'Unknown Donor',
              bloodType: dr.donorId.bloodType || 'Unknown',
              city: dr.donorId.city || 'Unknown',
              state: dr.donorId.state || 'Unknown',
              phone: dr.donorId.phone || 'Unknown',
              status: dr.status,   // Include the actual status from donorRequests
              updatedAt: dr.updatedAt || new Date()
            };
          }
          return null;
        })
        .filter(donor => donor !== null);
      
      console.log(`Request ${request._id} has ${allDonors.length} donors with statuses:`, 
        allDonors.map(d => `${d.name}: ${d.status}`));
      
      // Get only accepted/donated donors
      const acceptedDonors = allDonors.filter(donor => 
        donor.status === 'accepted' || donor.status === 'donated'
      );
      
      return {
        _id: request._id,
        bloodType: request.bloodType,
        createdAt: request.createdAt,
        status: request.overallStatus,
        acceptedDonors: acceptedDonors,
        allDonors: allDonors,
        pendingCount: request.donorRequests.filter(dr => dr.status === 'pending').length,
        rejectedCount: request.donorRequests.filter(dr => dr.status === 'rejected').length,
        donatedCount: request.donorRequests.filter(dr => dr.status === 'donated').length
      };
    });
    
    res.status(200).json({
      success: true,
      count: formattedRequests.length,
      data: formattedRequests
    });
  } catch (error) {
    console.error('Error getting blood request status:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Send blood request to a specific donor
exports.sendRequestToSpecificDonor = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const donorId = req.params.donorId;
    
    console.log(`Sending blood request ${requestId} to donor ${donorId}`);
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(requestId) || !mongoose.Types.ObjectId.isValid(donorId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID or donor ID'
      });
    }
    
    // Find the blood request
    const request = await BloodRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Blood request not found'
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
    
    // Check if donor is eligible (has matching blood type)
    // Define compatible blood types for the request
    let compatibleBloodTypes = [];
    switch(request.bloodType) {
      case 'A+':
        compatibleBloodTypes = ['A+', 'A-', 'O+', 'O-'];
        break;
      case 'A-':
        compatibleBloodTypes = ['A-', 'O-'];
        break;
      case 'B+':
        compatibleBloodTypes = ['B+', 'B-', 'O+', 'O-'];
        break;
      case 'B-':
        compatibleBloodTypes = ['B-', 'O-'];
        break;
      case 'AB+':
        compatibleBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        break;
      case 'AB-':
        compatibleBloodTypes = ['A-', 'B-', 'AB-', 'O-'];
        break;
      case 'O+':
        compatibleBloodTypes = ['O+', 'O-'];
        break;
      case 'O-':
        compatibleBloodTypes = ['O-'];
        break;
    }
    
    if (!compatibleBloodTypes.includes(donor.bloodType)) {
      return res.status(400).json({
        success: false,
        error: `Incompatible blood type. Request is for ${request.bloodType} but donor has ${donor.bloodType}`
      });
    }
    
    // Check if the request has already been sent to this donor
    const alreadySent = request.donorRequests.some(req => 
      req.donorId.toString() === donorId.toString()
    );
    
    if (alreadySent) {
      return res.status(400).json({
        success: false,
        error: 'Request has already been sent to this donor'
      });
    }
    
    // Add the request to the donor's pending requests
    donor.bloodRequests.push({
      requestId: request._id,
      status: 'pending',
      createdAt: new Date()
    });
    
    await donor.save();
    
    // Add the donor to the request's contacted donors
    request.donorRequests.push({
      donorId: donor._id,
      status: 'pending',
      createdAt: new Date()
    });
    
    await request.save();
    
    // Send notification (SMS or email) - implement in a real system
    console.log(`Notification sent to donor ${donor.name} (${donor.phone}) for blood request ${requestId}`);
    
    res.status(200).json({
      success: true,
      message: 'Blood request sent to donor successfully',
      data: {
        requestId: request._id,
        donorId: donor._id,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error sending blood request to donor:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// Add the confirmDonation function to handle donation confirmations
exports.confirmDonation = async (req, res) => {
  const { id } = req.params;
  const { donorId } = req.body;

  if (!donorId) {
    return res.status(400).json({ success: false, error: 'Donor ID is required' });
  }

  try {
    console.log(`Confirming donation for request ${id} from donor ${donorId}`);
    
    // Find the blood request
    const bloodRequest = await BloodRequest.findById(id);
    
    if (!bloodRequest) {
      return res.status(404).json({ success: false, error: 'Blood request not found' });
    }

    // Find the specific donor request
    const donorRequest = bloodRequest.donorRequests.find(
      dr => dr.donorId.toString() === donorId && dr.status === 'accepted'
    );

    if (!donorRequest) {
      // Check if this donor has a request with any status (might be already donated or rejected)
      const anyDonorRequest = bloodRequest.donorRequests.find(
        dr => dr.donorId.toString() === donorId
      );
      
      if (anyDonorRequest) {
        return res.status(400).json({ 
          success: false, 
          error: `This donor's request is already in '${anyDonorRequest.status}' status` 
        });
      }
      
      return res.status(400).json({ 
        success: false, 
        error: 'No accepted request found for this donor' 
      });
    }

    // Update the donor request to donated status
    donorRequest.status = 'donated';
    donorRequest.updatedAt = Date.now();
    
    // Update the overall status to fulfilled
    bloodRequest.overallStatus = 'fulfilled';
    
    // Save the changes
    await bloodRequest.save();
    
    // Update the donor's bloodRequests array and donation history
    const donor = await Donor.findById(donorId);
    if (donor) {
      // Update the donor's request for this blood request
      const donorRequestIndex = donor.bloodRequests.findIndex(
        req => req.requestId.toString() === id
      );
      
      if (donorRequestIndex !== -1) {
        donor.bloodRequests[donorRequestIndex].status = 'donated';
        donor.bloodRequests[donorRequestIndex].updatedAt = new Date();
      }
      
      // Update donation history
      donor.donationCount = (donor.donationCount || 0) + 1;
      donor.lastDonation = 'less_than_3_months'; // Use the enum value from schema
      
      await donor.save();
      console.log(`Updated donor ${donorId} with donated status for request ${id}`);
    } else {
      console.log(`Warning: Donor ${donorId} not found when confirming donation`);
    }

    return res.status(200).json({
      success: true,
      message: 'Donation confirmed successfully',
      bloodRequest
    });
  } catch (error) {
    console.error('Error confirming donation:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while confirming donation: ' + error.message
    });
  }
};

// Test function to create a sample blood request with donor requests
exports.createTestBloodRequest = async (req, res) => {
  try {
    const { phone, bloodType } = req.body;
    
    if (!phone || !bloodType) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and blood type are required'
      });
    }
    
    console.log(`Creating test blood request for phone: ${phone}, bloodType: ${bloodType}`);
    
    // Check if there are any donors in the system
    const donors = await Donor.find().limit(3);
    
    if (!donors || donors.length === 0) {
      // Create some sample donors if none exist
      const sampleDonors = [
        {
          name: 'Donor 1',
          bloodType: 'O-',
          phone: '9876543210',
          gender: 'male',
          age: 28,
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          lastDonation: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120), // 120 days ago
          password: 'password123',
          isAvailable: true
        },
        {
          name: 'Donor 2',
          bloodType: 'B+',
          phone: '9876543211',
          gender: 'female',
          age: 32,
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          lastDonation: new Date(Date.now() - 1000 * 60 * 60 * 24 * 100), // 100 days ago
          password: 'password123',
          isAvailable: true
        },
        {
          name: 'Donor 3',
          bloodType: 'A+',
          phone: '9876543212',
          gender: 'male',
          age: 25,
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          lastDonation: new Date(Date.now() - 1000 * 60 * 60 * 24 * 95), // 95 days ago
          password: 'password123',
          isAvailable: true
        }
      ];
      
      for (const donorData of sampleDonors) {
        await Donor.create(donorData);
      }
      
      console.log('Created sample donors');
      
      // Fetch the newly created donors
      const newDonors = await Donor.find().limit(3);
      donors.push(...newDonors);
    }
    
    // Create a blood request
    const requestData = {
      name: 'Test Requester',
      bloodType,
      gender: 'male',
      phone,
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      urgency: 'normal',
      reason: 'Testing blood request system',
      donorRequests: []
    };
    
    // Add donor requests with different statuses
    if (donors.length > 0) {
      requestData.donorRequests = [
        {
          donorId: donors[0]._id,
          status: 'accepted',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        }
      ];
      
      if (donors.length > 1) {
        requestData.donorRequests.push({
          donorId: donors[1]._id,
          status: 'pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
        });
      }
      
      if (donors.length > 2) {
        requestData.donorRequests.push({
          donorId: donors[2]._id,
          status: 'rejected',
          createdAt: new Date(Date.now() - 1000 * 60 * 90), // 90 minutes ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
        });
      }
    }
    
    // Create the blood request
    const bloodRequest = await BloodRequest.create(requestData);
    console.log('Created test blood request:', bloodRequest);
    
    return res.status(201).json({
      success: true,
      message: 'Test blood request created successfully',
      data: bloodRequest
    });
  } catch (error) {
    console.error('Error creating test blood request:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while creating test blood request'
    });
  }
};

// Using a simple approach - just export the exports object
module.exports = exports;
