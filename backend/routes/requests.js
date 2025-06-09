// server/routes/requests.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  getUserRequests,
  getRequestStatus,
  sendRequestToDonor,
  respondToRequest,
  updateDonationStatus
} = require('../controllers/requestController');

// Blood request routes
router.post('/', protect, createRequest);
router.get('/', getRequests);
router.get('/user', protect, getUserRequests);
router.get('/status', getRequestStatus);
router.get('/:id', getRequestById);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);

// Donor interaction routes
router.post('/:id/donors/:donorId/notify', protect, sendRequestToDonor);
router.post('/:id/respond', protect, respondToRequest);
router.put('/:id/donors/:donorId/status', protect, updateDonationStatus);

// Export the router
module.exports = router;