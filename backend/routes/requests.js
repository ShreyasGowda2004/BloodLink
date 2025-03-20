// server/routes/requests.js
const express = require('express');
const {
  getBloodRequests,
  getBloodRequestById,
  createBloodRequest,
  sendRequestToDonors,
  getBloodRequestStatus,
  sendRequestToSpecificDonor,
  confirmDonation,
  createTestBloodRequest
} = require('../controllers/requestController');

const router = express.Router();

// Get all blood requests and create a new one
router.route('/')
  .get(getBloodRequests)
  .post(createBloodRequest);

// Check blood request status (via query params: phone, bloodType)
// IMPORTANT: This must come BEFORE the /:id routes to avoid conflicts
router.get('/status', getBloodRequestStatus);

// Create a test blood request with sample data
router.post('/test', createTestBloodRequest);

// Get single blood request by ID
router.route('/:id')
  .get(getBloodRequestById);

// Send a blood request to matching donors
router.post('/:id/send-to-donors', sendRequestToDonors);

// Confirm a donation
router.post('/:id/confirm-donation', confirmDonation);

// Send blood request to a specific donor
router.post('/:requestId/donors/:donorId', sendRequestToSpecificDonor);

// Export the router
module.exports = router;