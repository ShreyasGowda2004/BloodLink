const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // OTP expires after 10 minutes (600 seconds)
  },
  verified: {
    type: Boolean,
    default: false,
  },
  donorData: {
    type: Object,
    required: false,
    default: {}
  },
  verificationSid: {
    type: String,
    required: true
  },
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp; 