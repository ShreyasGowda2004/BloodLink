// src/services/donorService.js
import api from './api';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
export const registerDonor = async (donorData, retryCount = 0) => {
  try {
    console.log('Attempting to register donor...');
    const response = await api.post('/donors', donorData);
    console.log('Donor registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering donor:', error.message);
    
    // If we haven't exceeded max retries and it's a timeout or network error
    if (retryCount < MAX_RETRIES && 
        (error.code === 'ECONNABORTED' || !error.response)) {
      console.log(`Retrying registration (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      await delay(RETRY_DELAY);
      return registerDonor(donorData, retryCount + 1);
    }
    
    // If we've exhausted retries or it's a different error
    if (error.response) {
      const errorMessage = error.response.data.message || 'Registration failed. Please try again later.';
      throw new Error(errorMessage);
    } else {
      throw new Error('Network error. Please check your connection and try again.');
    }
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

export const getDonors = async () => {
  try {
    const response = await api.get('/donors');
    return response.data;
  } catch (error) {
    console.error('Error fetching donors:', error.message);
    throw new Error('Failed to fetch donors. Please try again later.');
  }
};

export const updateDonor = async (id, donorData) => {
  try {
    const response = await api.put(`/donors/${id}`, donorData);
    return response.data;
  } catch (error) {
    console.error('Error updating donor:', error.message);
    throw new Error('Failed to update donor information. Please try again later.');
  }
};

export const deleteDonor = async (id) => {
  try {
    const response = await api.delete(`/donors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting donor:', error.message);
    throw new Error('Failed to delete donor. Please try again later.');
  }
};