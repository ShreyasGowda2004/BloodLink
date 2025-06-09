// src/services/requestService.js
import api from './api';

// Create a new blood request
export const createBloodRequest = async (requestData) => {
  try {
    console.log('Sending blood request to API:', requestData);
    const response = await api.post('/blood-requests', requestData);
    console.log('Blood request API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating blood request:', error);
    throw error;
  }
};

// Get all blood requests
export const getBloodRequests = async (filters = {}) => {
  try {
    const response = await api.get('/blood-requests', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    throw error;
  }
};

// Get a single blood request by ID
export const getBloodRequestById = async (requestId) => {
  try {
    const response = await api.get(`/blood-requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blood request with ID ${requestId}:`, error);
    throw error;
  }
};

// Update a blood request
export const updateBloodRequest = async (requestId, requestData) => {
  try {
    const response = await api.put(`/blood-requests/${requestId}`, requestData);
    return response.data;
  } catch (error) {
    console.error(`Error updating blood request with ID ${requestId}:`, error);
    throw error;
  }
};

// Delete a blood request
export const deleteBloodRequest = async (requestId) => {
  try {
    const response = await api.delete(`/blood-requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blood request with ID ${requestId}:`, error);
    throw error;
  }
};

// Get blood requests created by the current user
export const getUserBloodRequests = async () => {
  try {
    const response = await api.get('/blood-requests/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user blood requests:', error);
    throw error;
  }
};

// Get blood request status by phone number and blood type
export const getBloodRequestStatus = async (phone, bloodType) => {
  try {
    console.log(`Checking blood request status for phone: ${phone}, bloodType: ${bloodType}`);
    
    if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
      return {
        success: false,
        error: 'Please enter a valid 10-digit phone number',
        data: []
      };
    }

    const response = await api.get('/api/blood-requests/status', {
      params: {
        phone,
        bloodType
      }
    });
    
    console.log('Blood request status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking blood request status:', error);
    throw error;
  }
};

// Send blood request to a specific donor
export const sendRequestToDonor = async (requestId, donorId) => {
  try {
    const response = await api.post(`/blood-requests/${requestId}/donors/${donorId}/notify`);
    return response.data;
  } catch (error) {
    console.error('Error sending request to donor:', error);
    throw error;
  }
};

// Respond to a blood request (for donors)
export const respondToBloodRequest = async (requestId, responseData) => {
  try {
    const response = await api.post(`/blood-requests/${requestId}/respond`, responseData);
    return response.data;
  } catch (error) {
    console.error(`Error responding to blood request with ID ${requestId}:`, error);
    throw error;
  }
};

// Update donation status
export const updateDonationStatus = async (requestId, donorId, status) => {
  try {
    const response = await api.put(`/blood-requests/${requestId}/donors/${donorId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating donation status:', error);
    throw error;
  }
};

