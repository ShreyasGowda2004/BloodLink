// server/routes/donors.js
const express = require('express');
const {
  getDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor,
  loginDonor,
  getDonorRequests,
  updateRequestStatus,
  getDonorsByBloodType,
  getNearbyDonors
} = require('../controllers/donorController');
const router = express.Router();

// Login route
router.post('/login', loginDonor);

// Get all donors and create new donor
router.route('/')
  .get(getDonors)
  .post(createDonor);

// Get, update and delete donor by ID
router.route('/:id')
  .get(getDonorById)
  .put(updateDonor)
  .delete(deleteDonor);

// Get donor blood requests
router.get('/:id/requests', getDonorRequests);

// Update blood request status
router.put('/:donorId/requests/:requestId/:status', updateRequestStatus);

// Get donors by blood type
router.get('/bloodtype/:bloodType', getDonorsByBloodType);

// Get nearby donors
router.get('/nearby/:lat/:lng/:distance', getNearbyDonors);

module.exports = router;