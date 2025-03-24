import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaUserShield, FaLock, FaSignInAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
  const { login, error, clearError, isAuthenticated } = useContext(AdminContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If already authenticated, redirect to admin dashboard
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
    
    // Reset error state when component unmounts
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);
  
  // Update local error message if error comes from context
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000); // Hide error after 5 seconds
    }
  }, [error]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user is typing
    if (showError) {
      setShowError(false);
    }
  };
  
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.email.trim()) {
      setErrorMessage('Email is required');
      setShowError(true);
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      setShowError(true);
      return;
    }
    
    if (!formData.password) {
      setErrorMessage('Password is required');
      setShowError(true);
      return;
    }
    
    setIsSubmitting(true);
    clearError(); // Clear any previous errors
    
    const success = await login(formData);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/admin/dashboard');
    } else if (!errorMessage) {
      // Only set this if context didn't already set an error
      setErrorMessage('Invalid email or password');
      setShowError(true);
    }
  };
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        <div className="text-center mb-8">
          <FaUserShield className="mx-auto text-5xl text-red-600 mb-4" />
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sign in to access the admin dashboard
          </p>
        </div>
        
        <AnimatePresence>
          {showError && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            >
              <p>{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 flex items-center pl-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaUserShield />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'
                } border focus:ring-red-500 focus:border-red-500`}
                placeholder="admin@example.com"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 flex items-center pl-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaLock />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'
                } border focus:ring-red-500 focus:border-red-500`}
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium transition-colors ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                <FaSignInAlt className="mr-2" />
                Sign In
              </span>
            )}
          </button>
          
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className={`block mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-red-600 focus:outline-none focus:underline transition-colors`}
            >
              Back to main site
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
