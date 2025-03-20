// server/routes/otp.js
const express = require('express');
const otpController = require('../controllers/otpController');
const router = express.Router();

// Send OTP
router.post('/send', otpController.sendOTP);

// Verify OTP
router.post('/verify', otpController.verifyOTP);

// Resend OTP
router.post('/resend', otpController.resendOTP);

module.exports = router; 