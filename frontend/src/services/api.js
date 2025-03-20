// src/services/api.js
import axios from 'axios';

// Determine environment and set appropriate API base URL
const isDevelopment = import.meta.env.DEV;
const productionBackendURL = 'https://bloodlink-backend.onrender.com/api';
const developmentBackendURL = 'http://localhost:5000/api';

// Define API base URL using environment variables or fallback to appropriate URL based on environment
const baseURL = import.meta.env.VITE_API_URL || (isDevelopment ? developmentBackendURL : productionBackendURL);
console.log('Using API base URL:', baseURL);

// Create an axios instance with the base URL and default headers
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: false // Changed to false for cross-origin requests
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