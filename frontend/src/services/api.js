// src/services/api.js
import axios from 'axios';

// Determine environment and set appropriate API base URL
const isDevelopment = import.meta.env.DEV;
const productionBackendURL = 'https://bloodlink-b6fl.onrender.com/api';
const developmentBackendURL = 'http://localhost:5000/api';

// Define API base URL using environment variables or fallback to appropriate URL based on environment
const baseURL = import.meta.env.VITE_API_URL || (isDevelopment ? developmentBackendURL : productionBackendURL);
console.log('Using API base URL:', baseURL);

// Create an axios instance with the base URL and default headers
const api = axios.create({
  baseURL,
  timeout: 30000, // Increase timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // Changed to false for cross-origin requests
});

// Add a request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    // Add any auth tokens here if needed
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
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Please check your connection and try again.');
      return Promise.reject(new Error('Request timeout. Please check your connection and try again.'));
    }
    if (!error.response) {
      console.error('Network error. Please check your connection.');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    // Handle network errors, timeout errors, etc.
    console.error('API Error:', error.message || 'Unknown error');
    
    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);
    
    console.error('Full error details:', error);
    
    return Promise.reject(error);
  }
);

export default api;