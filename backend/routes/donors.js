// server/routes/donors.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerDonor,
  loginDonor,
  getDonorProfile,
  updateDonorProfile,
  getDonorDonations,
  addDonation,
  getNearbyDonors,
  getDonorRequests,
  updateRequestStatus,
  getAllDonors,
  updateDonor,
  deleteDonor
} = require('../controllers/donorController');

// Authentication routes
router.post('/register', registerDonor);
router.post('/login', loginDonor);

// Profile routes
router.get('/profile', protect, getDonorProfile);
router.put('/profile', protect, updateDonorProfile);

// Donation routes
router.get('/donations', protect, getDonorDonations);
router.post('/donations', protect, addDonation);

// Request routes
router.get('/:donorId/requests', protect, getDonorRequests);
router.put('/:donorId/requests/:requestId/:status', protect, updateRequestStatus);

// Location-based routes
router.get('/nearby', getNearbyDonors);

// Admin routes
router.get('/', protect, getAllDonors);
router.put('/:id', protect, updateDonor);
router.delete('/:id', protect, deleteDonor);

module.exports = router;