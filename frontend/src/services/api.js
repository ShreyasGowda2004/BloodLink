// src/services/api.js
import axios from 'axios';

// Determine environment and set appropriate API base URL
const isDevelopment = import.meta.env.DEV;
const productionBackendURL = 'https://bloodlink-b6fl.onrender.com';
const developmentBackendURL = 'http://localhost:5000';

// Define API base URL using environment variables or fallback to appropriate URL based on environment
const baseURL = import.meta.env.VITE_API_URL || (isDevelopment ? developmentBackendURL : productionBackendURL);
console.log('Using API base URL:', baseURL);

// Create an axios instance with the base URL and default headers
const api = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable credentials for cross-origin requests
});

// Add a request interceptor for logging and auth
// Add a request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    // Add /api prefix to all requests
    if (!config.url.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }
    console.log(`Making API request to: ${config.url}`);
    // Get token from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Please check your connection and try again.');
      return Promise.reject(new Error('Request timeout. Please check your connection and try again.'));
    }
    
    if (!error.response) {
      console.error('Network error. Please check your connection.');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 401:
        // Handle unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      
      case 403:
        return Promise.reject(new Error('You do not have permission to perform this action.'));
      
      case 404:
        return Promise.reject(new Error('The requested resource was not found.'));
      
      case 500:
        return Promise.reject(new Error('Server error. Please try again later.'));
      
      default:
        return Promise.reject(error.response.data || new Error('An error occurred. Please try again.'));
    }
  }
);

export default api;