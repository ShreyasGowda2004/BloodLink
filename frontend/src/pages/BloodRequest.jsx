// src/pages/BloodRequest.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { createBloodRequest } from '../services/requestService';
import { countries, getStatesForCountry, getCitiesForState } from '../data/locationData';

const BloodRequest = () => {
  const { darkMode } = useContext(ThemeContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    bloodType: '',
    country: '',
    state: '',
    city: '',
    gender: '',
    phone: '',
    urgency: 'normal',
    reason: '',
    hospitalName: '',
    hospitalLocation: '',
  });
  const [matchedDonors, setMatchedDonors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  
  // Add a new state variable for confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDonorIndex, setSelectedDonorIndex] = useState(null);
  
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
      console.log('Validating blood request form...');
      
      // Validate phone number format
      if (!/^\d{10}$/.test(formData.phone)) {
        setError('Please enter a valid 10-digit phone number');
        setIsSubmitting(false);
        return;
      }
      
      // Make sure all required fields are filled
      const requiredFields = ['name', 'bloodType', 'country', 'state', 'city', 'gender', 'phone', 'hospitalName', 'hospitalLocation'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }
      
      console.log('Submitting blood request form:', formData);
      
      // First submit the blood request
      const response = await createBloodRequest(formData);
      
      // Check if blood request creation was successful
      if (!response || !response.success) {
        const errorMsg = response?.error || 'Failed to submit blood request';
        console.error('Blood request creation failed:', errorMsg);
        setError(errorMsg);
        setIsSubmitting(false);
        return;
      }
      
      console.log('Blood request created successfully:', response);
      
      // Store the request ID for sending to donors later
      const requestId = response.data._id;
      
      // Now fetch donors with matching blood type
      try {
        console.log(`Fetching donors with blood type: ${formData.bloodType}`);
        const { getDonors } = await import('../services/donorService');
        const donorsResponse = await getDonors({ bloodType: formData.bloodType });
        
        console.log('Donors response:', donorsResponse);
        
        // Only use actual donors from the database, no mock data
        if (donorsResponse && donorsResponse.data && Array.isArray(donorsResponse.data) && donorsResponse.data.length > 0) {
          console.log(`Found ${donorsResponse.data.length} donors with blood type ${formData.bloodType}`);
          
          // Format the donors for display
          const processedDonors = donorsResponse.data.map(donor => {
            // Format the lastDonation for display
            let lastDonationDisplay = 'Never donated before';
            let isEligible = true;
            
            if (donor.lastDonation === 'less_than_3_months') {
              lastDonationDisplay = 'Less than 3 months ago';
              isEligible = false;
            } else if (donor.lastDonation === 'more_than_3_months') {
              lastDonationDisplay = 'More than 3 months ago';
            } else if (donor.lastDonation === 'never') {
              lastDonationDisplay = 'Never donated before';
            }
            
            return {
              ...donor,
              lastDonation: lastDonationDisplay,
              isEligible: isEligible,
              requestId: requestId, // Add the request ID to each donor for sending requests
              requestSent: false // Track if request has been sent to this donor
            };
          });
          
          console.log('Processed donors for display:', processedDonors);
          setMatchedDonors(processedDonors);
        } else {
          // If no donors found, set empty array (will show "No donors found" message)
          console.log(`No donors found with blood type ${formData.bloodType}`);
          setMatchedDonors([]);
        }
      } catch (donorError) {
        console.error('Error fetching donors:', donorError);
        // If donor fetching fails, show empty result
        setMatchedDonors([]);
      }
      
      setFormSubmitted(true);
    } catch (error) {
      console.error('Request submission error:', error);
      setError('Failed to process your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Modify the handleSendRequest function to first show confirmation
  const handleSendRequest = async (donorId, index) => {
    const donor = matchedDonors[index];
    if (!donor || !donor.requestId) {
      setError('Unable to send request: missing request information');
      return;
    }
    
    // Set the selected donor and show confirmation dialog
    setSelectedDonorIndex(index);
    setShowConfirmation(true);
  };
  
  // Add a new function to handle confirmed request submission
  const confirmAndSendRequest = async () => {
    try {
      const index = selectedDonorIndex;
      const donor = matchedDonors[index];
      const donorId = donor._id;
      const requestId = donor.requestId;
      
      console.log(`Sending blood request ${requestId} to donor ${donorId}`);
      
      // Import the sendRequestToDonor function
      const { sendRequestToDonor } = await import('../services/requestService');
      const response = await sendRequestToDonor(requestId, donorId);
      
      if (response.success) {
        // Update the UI to show that request was sent
        const updatedDonors = [...matchedDonors];
        updatedDonors[index] = { ...updatedDonors[index], requestSent: true };
        setMatchedDonors(updatedDonors);
        
        console.log('Blood request sent successfully to donor');
        
        // No alert - just set a message in the UI instead of using an alert
        setSuccessMessage('Request has been sent to the donor.');
      } else {
        console.error('Failed to send request to donor:', response.error);
        setError(response.error || 'Failed to send request to donor');
      }
    } catch (error) {
      console.error('Error sending request to donor:', error);
      setError('Failed to send request to donor. Please try again.');
    } finally {
      // Close the confirmation dialog
      setShowConfirmation(false);
      setSelectedDonorIndex(null);
    }
  };
  
  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md mx-4`}
            >
              <h3 className="text-xl font-semibold mb-4">Confirm Blood Request</h3>
              <p className="mb-6">
                Are you sure you want to send a blood donation request to 
                <span className="font-medium"> {matchedDonors[selectedDonorIndex]?.name}</span>?
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedDonorIndex(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmAndSendRequest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Yes, Send Request
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Request Blood</h1>
          
          {!formSubmitted ? (
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
                  
                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-medium" htmlFor="phone">Emergency Contact Number</label>
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
                  
                  {/* Blood Request Information */}
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 mt-4 border-b pb-2">Blood Request Details</h2>
                  </div>
                  
                  {/* Blood Type */}
                  <div className="md:col-span-1">
                    <label className="block mb-2 font-medium" htmlFor="bloodType">Blood Type Needed</label>
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
                  
                  {/* Urgency */}
                  <div className="md:col-span-1">
                    <label className="block mb-2 font-medium" htmlFor="urgency">Urgency Level</label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  
                  {/* Reason */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-medium" htmlFor="reason">Reason for Blood Request</label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full p-3 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    ></textarea>
                  </div>
                  
                  {/* Location Information */}
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
                      disabled={!formData.country}
                      className={`w-full p-3 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      } ${!formData.country ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                      disabled={!formData.state}
                      className={`w-full p-3 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      } ${!formData.state ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select City</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Hospital Information */}
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 mt-4 border-b pb-2">Hospital Information</h2>
                  </div>
                  
                  {/* Hospital Name */}
                  <div className="md:col-span-1">
                    <label className="block mb-2 font-medium" htmlFor="hospitalName">Hospital Name</label>
                    <input
                      type="text"
                      id="hospitalName"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  
                  {/* Hospital Location */}
                  <div className="md:col-span-1">
                    <label className="block mb-2 font-medium" htmlFor="hospitalLocation">Hospital Location</label>
                    <input
                      type="text"
                      id="hospitalLocation"
                      name="hospitalLocation"
                      value={formData.hospitalLocation}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-lg ${
                      isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                    } text-white font-semibold`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </motion.button>
                  
                  {error && (
                    <p className="mt-4 text-red-500 font-medium">{error}</p>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 md:p-8 rounded-lg shadow-lg`}>
              <h2 className="text-2xl font-bold mb-6">Matched Donors</h2>
              
              {matchedDonors.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-center mb-4 font-medium">
                    We found {matchedDonors.length} donors matching your blood type {formData.bloodType}
                  </p>
                  
                  {/* Success message when request is sent */}
                  {successMessage && (
                    <div className="p-4 mb-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center">
                      <p>{successMessage}</p>
                      <p className="mt-2">
                        <a 
                          href="/request-status" 
                          className="underline font-medium hover:text-green-700 dark:hover:text-green-300"
                        >
                          Check Request Status Page
                        </a> for updates.
                      </p>
                    </div>
                  )}
                  
                  {matchedDonors.map((donor, index) => (
                    <motion.div
                      key={donor._id || donor.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 border rounded-lg ${
                        darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{donor.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Blood Type: <span className="font-medium text-red-600">{donor.bloodType}</span> • 
                            {donor.city && <span>City: {donor.city} • </span>}
                            {donor.state && <span>State: {donor.state} • </span>}
                            Last Donation: {donor.lastDonation || 'Not available'}
                            {donor.isEligible === false && (
                              <span className="ml-2 text-yellow-500 font-medium">
                                • Recently donated, may not be eligible
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <motion.a
                            href={`tel:${donor.phone}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium"
                          >
                            Contact
                          </motion.a>
                          {!donor.requestSent ? (
                            <motion.button
                              onClick={() => handleSendRequest(donor._id, index)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium"
                            >
                              Request Blood
                            </motion.button>
                          ) : (
                            <span className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium">
                              Request Sent
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="mt-8 text-center">
                    <p className="mb-4 text-gray-500 dark:text-gray-400">
                      Your request has been registered. We'll notify you if more donors become available.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.href = '/'}
                      className="px-6 py-2 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
                    >
                      Return to Home
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-xl font-medium mt-4 mb-2">No donors found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    We couldn't find any donors with blood type {formData.bloodType} in our database.
                    Your request has been registered and we'll notify you when a matching donor becomes available.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-2 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
                  >
                    Return to Home
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BloodRequest;