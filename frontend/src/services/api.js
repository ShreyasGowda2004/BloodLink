// src/services/api.js
import axios from 'axios';

// Define API base URL using Vite environment variables
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('Using API base URL:', baseURL);

// Create an axios instance with the base URL and default headers
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Successfully received response
    return response;
  },
  (error) => {
    // Handle network errors, timeout errors, etc.
    console.error('API Error:', error.message || 'Unknown error');
    
    if (error.response) {
      // Server responded with an error code
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server');
    } else {
      // Error in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    console.error('Full error details:', error);
    
    return Promise.reject(error);
  }
);

export default api;