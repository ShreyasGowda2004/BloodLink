// server/models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  state: {
    type: String,
    required: [true, 'State is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  urgency: {
    type: String,
    required: [true, 'Urgency level is required'],
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal',
  },
  reason: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending',
  },
  fulfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    default: null,
  },
  fulfilledAt: {
    type: Date,
    default: null,
  },
  geoLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // [longitude, latitude]
    },
  },
  matchedDonors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
  }],
}, {
  timestamps: true,
});

// Create index for geo queries
requestSchema.index({ geoLocation: '2dsphere' });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;