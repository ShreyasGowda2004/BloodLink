const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  hospitalName: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  hospitalLocation: {
    type: String,
    required: [true, 'Hospital location is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal'
  },
  reason: {
    type: String,
    trim: true
  },
  // Track donors this request has been sent to
  donorRequests: [
    {
      donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'donated'],
        default: 'pending'
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  overallStatus: {
    type: String,
    enum: ['pending', 'fulfilled', 'expired'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for search
bloodRequestSchema.index({ bloodType: 1 });
bloodRequestSchema.index({ phone: 1 });

// Add a method to get overall status
bloodRequestSchema.methods.getOverallStatus = function() {
  // If any donor has accepted, mark as fulfilled
  if (this.donorRequests.some(req => req.status === 'accepted' || req.status === 'donated')) {
    return 'fulfilled';
  }
  
  // If all donors have rejected, mark as expired
  if (this.donorRequests.length > 0 && 
      this.donorRequests.every(req => req.status === 'rejected')) {
    return 'expired';
  }
  
  // Otherwise, still pending
  return 'pending';
};

// Update the overall status before saving
bloodRequestSchema.pre('save', function(next) {
  this.overallStatus = this.getOverallStatus();
  next();
});

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);

module.exports = BloodRequest; 