// src/pages/DonorRegistration.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { registerDonor } from '../services/donorService';
import { countries, getStatesForCountry, getCitiesForState } from '../data/locationData';

const DonorRegistration = () => {
  const { darkMode } = useContext(ThemeContext);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    bloodType: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    smoking: 'no',
    drinking: 'no',
    lastDonation: 'never',
    password: '',
    confirmPassword: ''
  });
  
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update states list when country changes
    if (name === 'country') {
      setFormData(prev => ({ ...prev, state: '', city: '' }));
      setAvailableStates(getStatesForCountry(value));
      setAvailableCities([]);
    }
    
    // Update cities list when state changes
    if (name === 'state') {
      setFormData(prev => ({ ...prev, city: '' }));
      setAvailableCities(getCitiesForState(value));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError('');
      console.log('Validating donor registration form...');

      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      // Validate phone number format
      if (!/^\d{10}$/.test(formData.phone)) {
        setError('Please enter a valid 10-digit phone number');
        setIsSubmitting(false);
        return;
      }

      // Validate age
      const age = parseInt(formData.age, 10);
      if (isNaN(age) || age < 18 || age > 65) {
        setError('Age must be between 18 and 65');
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting donor registration form:', formData);
      
      // Call the actual API to register the donor
      const response = await registerDonor(formData);
      console.log('Donor registration response:', response);
      
      if (response.success) {
        setFormSubmitted(true);
        console.log('Donor registered successfully:', response.donor || response.data);
      } else {
        console.error('Registration failed:', response.error);
        setError(response.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration service unavailable. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (formSubmitted) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`max-w-md mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-lg text-center`}
          >
            <div className="mb-6 relative">
              {/* Confetti elements */}
              <motion.div
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      backgroundColor: [
                        '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
                        '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', 
                        '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
                        '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
                      ][Math.floor(Math.random() * 16)]
                    }}
                    initial={{
                      y: -20,
                      x: -50 + Math.random() * 100,
                      opacity: 1
                    }}
                    animate={{
                      y: 100 + Math.random() * 50,
                      x: -100 + Math.random() * 200,
                      opacity: 0
                    }}
                    transition={{
                      duration: 1 + Math.random() * 2,
                      delay: Math.random(),
                      ease: "easeOut"
                    }}
                  />
                ))}
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center relative"
              >
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
                >
                  <motion.path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
                <motion.div
                  className="absolute w-full h-full rounded-full border-4 border-white opacity-40"
                  animate={{ 
                    scale: [1, 1.1, 1], 
                    opacity: [0.4, 0.7, 0.4] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "loop" 
                  }}
                />
              </motion.div>
            </div>
            <motion.h2 
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Registration Successful!
            </motion.h2>
            <motion.p 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Thank you for registering as a blood donor. Your generosity can save lives.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-red-600 text-white rounded-full"
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Donor Registration</h1>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 md:p-8 rounded-lg shadow-lg`}>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2">Personal Information</h2>
                </div>
                
                {/* Name */}
                <div className="md:col-span-1">
                  <label className="block mb-2 font-medium" htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                
                {/* Age */}
                <div className="md:col-span-1">
                  <label className="block mb-2 font-medium" htmlFor="age">Age</label>
                  <input type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="65"
                    required
                    className={`w-full p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                
                {/* Gender */}
                <div className="md:col-span-1">
                  <label className="block mb-2 font-medium">Gender</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                        required
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Female
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === 'other'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Other
                    </label>
                  </div>
                </div>
                
                {/* Blood Type */}
                <div className="md:col-span-1">
                  <label className="block mb-2 font-medium" htmlFor="bloodType">Blood Type</label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="">Select Blood Type</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Phone */}
                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium" htmlFor="phone">Mobile Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    className={`w-full p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                
                {/* Password */}
                <div className="md:col-span-1">
                  <label className="block mb-2 font-medium" htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className={`w-full p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Password will be used for donor login
                  </p>
                </div>
                
                {/* Confirm Password */}
                <div className="md:col-span-1">
                  <label className="block mb-2 font-medium" htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className={`w-full p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    } ${formData.password !== formData.confirmPassword && formData.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>
                
                {/* Location Section */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 mt-4 border-b pb-2">Location Information</h2>
                </div>
                
                {/* Country */}
                <div className="md:col-span-1">
                  <label className="block mb-2 font-medium" htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                
                {/* State */}
                <div className="md:col-span-1">
                  <label className="block mb-2 font-medium" htmlFor="state">State</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    disabled={availableStates.length === 0}
                    className={`w-full p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="">Select State</option>
                    {availableStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                {/* City */}
                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium" htmlFor="city">City</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={availableCities.length === 0}
                    className={`w-full p-3 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="">Select City</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                {/* Health Section */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 mt-4 border-b pb-2">Health Information</h2>
                </div>
                
                {/* Last Donation */}
                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium">When was your last blood donation?</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="lastDonation"
                        value="never"
                        checked={formData.lastDonation === 'never'}
                        onChange={handleChange}
                        required
                        className="mr-2"
                      />
                      Never donated before
                    </label>
                    <label className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="lastDonation"
                        value="less_than_3_months"
                        checked={formData.lastDonation === 'less_than_3_months'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Less than 3 months ago
                    </label>
                    <label className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="lastDonation"
                        value="more_than_3_months"
                        checked={formData.lastDonation === 'more_than_3_months'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      More than 3 months ago
                    </label>
                  </div>
                </div>
                
                {/* Smoking */}
                <div className="md:col-span-1">
                  <label className="block mb-2 font-medium">Do you smoke?</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="smoking"
                        value="yes"
                        checked={formData.smoking === 'yes'}
                        onChange={handleChange}
                        required
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="smoking"
                        value="no"
                        checked={formData.smoking === 'no'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
                
                {/* Drinking */}
                <div className="md:col-span-1">
                  <label className="block mb-2 font-medium">Do you drink alcohol?</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="drinking"
                        value="yes"
                        checked={formData.drinking === 'yes'}
                        onChange={handleChange}
                        required
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="drinking"
                        value="no"
                        checked={formData.drinking === 'no'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || formData.password !== formData.confirmPassword}
                  className={`w-full py-3 px-6 rounded-lg ${
                    isSubmitting || formData.password !== formData.confirmPassword || !formData.phone || formData.phone.length !== 10
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                  } text-white font-semibold`}
                >
                  {isSubmitting ? 'Registering...' : 'Register as Donor'}
                </motion.button>
                {(!formData.phone || formData.phone.length !== 10) && !isSubmitting && (
                  <p className="mt-2 text-sm text-center text-red-500">
                    Please enter a valid 10-digit mobile number to register
                  </p>
                )}
                {formData.password !== formData.confirmPassword && formData.confirmPassword && !isSubmitting && (
                  <p className="mt-2 text-sm text-center text-red-500">
                    Passwords must match to register
                  </p>
                )}
              </div>
            </form>
            {error && (
              <div className="my-4 text-center text-red-500 font-medium">{error}</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DonorRegistration;