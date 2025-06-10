// server/models/Donor.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Must be at least 18 years old'],
    max: [65, 'Must be no more than 65 years old'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other'],
  },
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    unique: true,
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
  smoking: {
    type: String,
    required: [true, 'Smoking status is required'],
    enum: ['yes', 'no'],
  },
  drinking: {
    type: String,
    required: [true, 'Drinking status is required'],
    enum: ['yes', 'no'],
  },
  lastDonation: {
    type: String,
    required: [true, 'Last donation information is required'],
    enum: ['never', 'less_than_3_months', 'more_than_3_months'],
    default: 'never',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default in queries
  },
  donationCount: {
    type: Number,
    default: 0,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // [longitude, latitude]
      required: false,
    },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  // List of blood requests directed to this donor
  bloodRequests: [
    {
      requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodRequest',
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'donated'],
        default: 'pending',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  timestamps: true,
});

// Create index for geo queries
donorSchema.index({ location: '2dsphere' });
// Create index for phone number lookups (for login)
donorSchema.index({ phone: 1 });

// Hash the password before saving to db
donorSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if entered password is correct
donorSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;