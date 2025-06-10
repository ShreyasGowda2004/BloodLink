// src/services/requestService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a new blood request
export const createBloodRequest = async (requestData) => {
  try {
    console.log('Sending blood request to API:', requestData);
    const response = await axios.post(`${API_URL}/requests`, requestData);
    console.log('Blood request API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating blood request:', error);
    
    // Handle specific error responses
    if (error.response) {
      console.error('Server response error:', error.response.data);
      
      // Handle validation errors
      if (error.response.status === 400) {
        return {
          success: false,
          error: error.response.data.error || 'Please check your input and try again'
        };
      }
      
      // Handle server errors
      if (error.response.status >= 500) {
        return {
          success: false,
          error: 'Server error. Please try again later.'
        };
      }
    }
    
    // Handle network errors
    if (error.request && !error.response) {
      console.error('Network error - no response received');
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    }
    
    // Generic error fallback
    return {
      success: false,
      error: 'Failed to create blood request. Please try again.'
    };
  }
};

// Send blood request to a specific donor
export const sendRequestToDonor = async (requestId, donorId) => {
  try {
    console.log(`Sending request ${requestId} to donor ${donorId}`);
    
    // Validate IDs before sending
    if (!requestId || !donorId) {
      console.error('Missing requestId or donorId');
      return {
        success: false,
        error: 'Invalid request or donor information. Please try again.'
      };
    }
    
    const response = await axios.post(`${API_URL}/requests/${requestId}/donors/${donorId}`);
    console.log('Send request to donor response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending request to donor:', error);
    
    // Handle specific error responses from the server
    if (error.response) {
      console.error('Server responded with error:', error.response.status, error.response.data);
      
      if (error.response.status === 400) {
        return {
          success: false,
          error: error.response.data.error || 'Request already sent to this donor'
        };
      }
      
      if (error.response.status === 404) {
        return {
          success: false,
          error: error.response.data.error || 'Request or donor not found'
        };
      }
      
      if (error.response.data && error.response.data.error) {
        return {
          success: false,
          error: error.response.data.error
        };
      }
    }
    
    // Handle network errors
    if (error.request && !error.response) {
      console.error('Network error - no response received');
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    }
    
    // Generic error fallback
    return {
      success: false,
      error: 'Failed to send request to donor. Please try again.'
    };
  }
};

// Get all blood requests
export const getBloodRequests = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/requests`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    return { 
      success: false, 
      error: error.message || 'Error fetching blood requests',
      data: [] 
    };
  }
};

// Get a single blood request by ID
export const getBloodRequestById = async (requestId) => {
  try {
    const response = await axios.get(`${API_URL}/requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blood request with ID ${requestId}:`, error);
    return { 
      success: false, 
      error: error.message || `Error fetching blood request with ID ${requestId}`
    };
  }
};

// Update a blood request
export const updateBloodRequest = async (requestId, requestData) => {
  try {
    const response = await axios.put(`${API_URL}/requests/${requestId}`, requestData);
    return response.data;
  } catch (error) {
    console.error(`Error updating blood request with ID ${requestId}:`, error);
    throw error;
  }
};

// Delete a blood request
export const deleteBloodRequest = async (requestId) => {
  try {
    const response = await axios.delete(`${API_URL}/requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blood request with ID ${requestId}:`, error);
    throw error;
  }
};

// Get blood requests created by the current user
export const getUserBloodRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/requests/user`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user blood requests:', error);
    throw error;
  }
};

// Respond to a blood request (for donors)
export const respondToBloodRequest = async (requestId, responseData) => {
  try {
    const response = await axios.post(`${API_URL}/requests/${requestId}/respond`, responseData);
    return response.data;
  } catch (error) {
    console.error(`Error responding to blood request with ID ${requestId}:`, error);
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
    
    const url = `${API_URL}/requests/status?phone=${phone}${bloodType ? `&bloodType=${bloodType}` : ''}`;
    
    const response = await axios.get(url);
    console.log('Blood request status response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error checking blood request status:', error);
    
    // Handle 404 not found errors
    if (error.response && error.response.status === 404) {
      return {
        success: false,
        error: error.response.data.error || 'No blood requests found with this information',
        data: []
      };
    }
    
    // Handle bad request errors
    if (error.response && error.response.status === 400) {
      return {
        success: false,
        error: error.response.data.error || 'Invalid request parameters',
        data: []
      };
    }
    
    return {
      success: false,
      error: 'Failed to check blood request status. Please try again later.',
      data: []
    };
  }
};

export const sendRequestToDonors = async (requestId) => {
  try {
    const response = await axios.post(`${API_URL}/requests/${requestId}/send-to-donors`);
    return response.data;
  } catch (error) {
    console.error('Error sending request to donors:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send request to donors'
    };
  }
};

// Update donation status for a donor in a blood request
export const updateDonationStatus = async (requestId, donorId, status) => {
  try {
    console.log(`Updating donation status for request ${requestId}, donor ${donorId} to ${status}`);
    
    // The server route is confirm-donation rather than confirm
    const response = await axios.post(`${API_URL}/requests/${requestId}/confirm-donation`, { donorId });
    
    console.log('Update donation status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating donation status:', error);
    
    // Handle specific HTTP error responses
    if (error.response) {
      if (error.response.status === 404) {
        return {
          success: false,
          error: 'Request or donor not found. Please check the IDs and try again.'
        };
      }
      
      if (error.response.data && error.response.data.error) {
        return {
          success: false,
          error: error.response.data.error
        };
      }
    }
    
    // Generic error fallback
    return {
      success: false,
      error: error.message || 'Failed to update donation status'
    };
  }
};