// server/routes/donors.js
const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/donorController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerDonor);
router.post('/login', loginDonor);
router.get('/nearby', getNearbyDonors);

// Protected routes
router.get('/profile', protect, getDonorProfile);
router.put('/profile', protect, updateDonorProfile);
router.get('/donations', protect, getDonorDonations);
router.post('/donations', protect, addDonation);
router.get('/:donorId/requests', protect, getDonorRequests);
router.put('/:donorId/requests/:requestId/:status', protect, updateRequestStatus);

// Admin routes
router.get('/', protect, admin, getAllDonors);

module.exports = router;