// src/services/donorService.js
import api from './api';

// Get donor by ID
export const getDonorById = async (donorId) => {
  try {
    console.log('Fetching donor by ID:', donorId);
    const response = await api.get(`/donors/${donorId}`);
    console.log('Donor data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching donor by ID:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch donor information'
    };
  }
};

// Login donor
export const loginDonor = async (credentials) => {
  try {
    console.log('Sending login request:', credentials);
    const response = await api.post('/donors/login', credentials);
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    
    // If it's an authentication error (401), return the error message
    if (error.response && error.response.status === 401) {
      return {
        success: false,
        error: 'Invalid phone number or password'
      };
    }
    
    // For other errors, return a generic error
    return {
      success: false,
      error: 'Login failed. Please try again later.'
    };
  }
};

// Register a new donor
export const registerDonor = async (donorData) => {
  try {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...dataToSend } = donorData;
    
    console.log('Sending donor data to API:', dataToSend);
    const response = await api.post('/donors', dataToSend);
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering donor:', error);
    
    // Phone number already exists
    if (error.response && error.response.status === 400 && 
        error.response.data.error && error.response.data.error.includes('Phone number already registered')) {
      return {
        success: false,
        error: 'This phone number is already registered. Please use a different phone number or login to your account.'
      };
    }
    
    // If it's a validation error (400), return the error message
    if (error.response && error.response.status === 400) {
      return {
        success: false,
        error: error.response.data.error || 'Validation failed'
      };
    }
    
    // For server errors, return a generic error
    return {
      success: false,
      error: 'Failed to register. Please try again later.'
    };
  }
};

// Get donor profile
export const getDonorProfile = async () => {
  try {
    const response = await api.get('/donors/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching donor profile:', error);
    throw error;
  }
};

// Update donor profile
export const updateDonorProfile = async (donorData) => {
  try {
    const response = await api.put('/donors/profile', donorData);
    return response.data;
  } catch (error) {
    console.error('Error updating donor profile:', error);
    throw error;
  }
};

// Get donor donation history
export const getDonorDonations = async () => {
  try {
    const response = await api.get('/donors/donations');
    return response.data;
  } catch (error) {
    console.error('Error fetching donor donations:', error);
    throw error;
  }
};

// Add new donation record
export const addDonation = async (donationData) => {
  try {
    const response = await api.post('/donors/donations', donationData);
    return response.data;
  } catch (error) {
    console.error('Error adding donation:', error);
    throw error;
  }
};

// Get nearby donors
export const getNearbyDonors = async (bloodType, location, radius = 10) => {
  try {
    const response = await api.get('/donors/nearby', {
      params: { bloodType, location, radius }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby donors:', error);
    throw error;
  }
};

// Get donor's blood requests
export const getDonorRequests = async (donorId) => {
  try {
    console.log('Fetching blood requests for donor:', donorId);
    const response = await api.get(`/donors/${donorId}/requests`);
    console.log('Donor requests response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching donor requests:', error);
    
    // For errors, return empty data
    return { 
      success: false, 
      error: error.message || 'Error fetching donor requests', 
      data: [] 
    };
  }
};

// Update blood request status (accept/reject)
export const updateRequestStatus = async (donorId, requestId, status) => {
  try {
    console.log(`Updating request ${requestId} status to ${status} for donor ${donorId}`);
    const response = await api.put(`/donors/${donorId}/requests/${requestId}/${status}`);
    console.log('Update request status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating request status:', error);
    return {
      success: false,
      error: error.message || 'Failed to update request status'
    };
  }
};

export const getDonors = async (filters = {}) => {
  try {
    console.log('Fetching donors with filters:', filters);
    const response = await api.get('/donors', { params: filters });
    console.log('Donors API response data:', response.data);
    
    // Return the data in a consistent format
    if (response.data) {
      return response.data;
    }
    
    return { success: false, data: [] };
  } catch (error) {
    console.error('Error fetching donors:', error);
    
    // For all errors, return empty data - no mock donors
    return { 
      success: false, 
      error: error.message || 'Error fetching donors', 
      data: [] 
    };
  }
};