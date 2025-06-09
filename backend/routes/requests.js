// server/routes/requests.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBloodRequest,  // Changed from createRequest
  getBloodRequests,    // Changed from getRequests
  getBloodRequestById, // Changed from getRequestById
  updateRequest,
  deleteRequest,
  getBloodRequestStatus, // Changed from getRequestStatus
  sendRequestToSpecificDonor, // Changed from sendRequestToDonor
  confirmDonation,     // Changed from respondToRequest
  updateDonationStatus
} = require('../controllers/requestController');

// Blood request routes
router.post('/', protect, createBloodRequest);
router.get('/', getBloodRequests);
router.get('/user', protect, getBloodRequests); // Changed from getUserRequests
router.get('/status', getBloodRequestStatus);
router.get('/:id', getBloodRequestById);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);

// Donor interaction routes
router.post('/:id/donors/:donorId/notify', protect, sendRequestToSpecificDonor);
router.post('/:id/respond', protect, confirmDonation);
router.put('/:id/donors/:donorId/status', protect, updateDonationStatus);

// Export the router
module.exports = router;