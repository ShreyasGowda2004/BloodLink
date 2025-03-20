import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { getBloodRequestStatus, updateDonationStatus } from '../services/requestService';

const RequestStatus = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [searched, setSearched] = useState(false);
  const [showDonationConfirmation, setShowDonationConfirmation] = useState(false);
  const [donationDetails, setDonationDetails] = useState({ requestId: null, donorId: null, donorName: null });
  const [successMessage, setSuccessMessage] = useState('');
  
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');
      
      if (!phone) {
        setError('Please enter your phone number');
        return;
      }
      
      if (!/^\d{10}$/.test(phone)) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }
      
      // Blood type is now optional but preferred
      
      console.log('Checking request status for:', { phone, bloodType });
      
      const response = await getBloodRequestStatus(phone, bloodType);
      console.log('Status check response:', response);
      
      if (response.success) {
        setRequests(response.data);
        setSearched(true);
        setError('');
      } else {
        setError(response.error || 'No blood requests found with this information');
        setRequests([]);
        setSearched(true);
      }
    } catch (error) {
      console.error('Error checking request status:', error);
      setError('Failed to check request status. Please try again later.');
      setRequests([]);
      setSearched(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateNewRequest = () => {
    navigate('/blood-request', { 
      state: { 
        phone, 
        bloodType 
      } 
    });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'fulfilled':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };
  
  const getDonorStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'donated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleMarkAsDonated = (requestId, donorId, donorName) => {
    console.log('Mark as donated clicked for:', { requestId, donorId, donorName });
    
    if (!donorId) {
      console.error('Error: donorId is undefined', { requestId, donorName });
      setError('Cannot mark as donated: donor ID is missing');
      return;
    }
    
    setDonationDetails({
      requestId,
      donorId,
      donorName
    });
    setShowDonationConfirmation(true);
  };
  
  const confirmDonation = async () => {
    try {
      setIsLoading(true);
      
      // Double check that we have all the required data
      if (!donationDetails.requestId || !donationDetails.donorId) {
        console.error('Cannot confirm donation - missing data:', donationDetails);
        setError('Cannot update donation status: missing request or donor ID');
        setShowDonationConfirmation(false);
        return;
      }
      
      console.log('Confirming donation with details:', donationDetails);
      
      const response = await updateDonationStatus(
        donationDetails.requestId,
        donationDetails.donorId,
        'donated'
      );
      
      console.log('Donation status update response:', response);
      
      if (response.success) {
        // Update local state to reflect the change
        setRequests(prevRequests => prevRequests.map(request => {
          if (request._id === donationDetails.requestId) {
            return {
              ...request,
              allDonors: request.allDonors.map(donor => 
                donor._id === donationDetails.donorId 
                  ? { ...donor, status: 'donated' } 
                  : donor
              ),
              acceptedDonors: request.acceptedDonors.map(donor => 
                donor._id === donationDetails.donorId 
                  ? { ...donor, status: 'donated' } 
                  : donor
              )
            };
          }
          return request;
        }));
        
        // Show success message
        setError('');
        setSuccessMessage(`Donation from ${donationDetails.donorName} has been successfully recorded. Thank you!`);
      } else {
        setError(response.error || 'Failed to update donation status');
      }
      
      // Close the confirmation dialog
      setShowDonationConfirmation(false);
      setDonationDetails({ requestId: null, donorId: null, donorName: null });
    } catch (error) {
      console.error('Error marking donation as complete:', error);
      setError('Failed to update donation status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        {showDonationConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md mx-4`}
            >
              <h3 className="text-xl font-semibold mb-4">Confirm Donation</h3>
              <p className="mb-6">
                Has <span className="font-medium">{donationDetails.donorName}</span> completed 
                the blood donation? This will update their status to "Donated".
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDonationConfirmation(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDonation}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Yes, Donated
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
          <h1 className="text-3xl font-bold mb-8 text-center">Check Blood Request Status</h1>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg mb-8`}>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter the phone number used for your request"
                  pattern="[0-9]{10}"
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium" htmlFor="bloodType">
                  Blood Type (Optional)
                </label>
                <select
                  id="bloodType"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="">All Blood Types</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {error && (
                <div className="mb-4 text-center text-red-500 font-medium">
                  {error}
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg ${
                  isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                } text-white font-semibold`}
              >
                {isLoading ? 'Checking...' : 'Check Status'}
              </motion.button>
            </form>
            
            {successMessage && (
              <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center">
                <p>{successMessage}</p>
              </div>
            )}
          </div>
          
          {searched && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Your Blood Requests</h2>
              
              {(!requests || requests.length === 0) ? (
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md text-center`}>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No blood requests found for the provided phone number and blood type.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateNewRequest}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                  >
                    Create New Request
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6">
                  {requests.map((request, index) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
                    >
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <div>
                          <span className="font-medium">Blood Type:</span> 
                          <span className="text-red-600 ml-2 font-semibold">{request.bloodType}</span>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Requested on {formatDate(request.createdAt)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                          <div className="font-medium">{request.acceptedDonors.length}</div>
                          <div className="text-gray-500 dark:text-gray-400">Accepted</div>
                        </div>
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                          <div className="font-medium">{request.pendingCount}</div>
                          <div className="text-gray-500 dark:text-gray-400">Pending</div>
                        </div>
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                          <div className="font-medium">{request.rejectedCount}</div>
                          <div className="text-gray-500 dark:text-gray-400">Rejected</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Donors for Your Request</h3>
                        {request.allDonors && request.allDonors.length > 0 ? (
                          <div className="space-y-3">
                            {request.allDonors.map((donor, idx) => (
                              <div 
                                key={idx}
                                className={`p-3 rounded border ${
                                  darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">{donor.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {donor.city}, {donor.state}
                                    </div>
                                    <div className="text-sm mt-1">
                                      <span className={`px-2 py-0.5 rounded text-xs ${getDonorStatusColor(donor.status)}`}>
                                        {donor.status === 'donated' ? 'Donated' : 
                                          donor.status.charAt(0).toUpperCase() + donor.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {donor.status === 'accepted' && (
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          console.log('Donor object:', donor);
                                          handleMarkAsDonated(request._id, donor._id, donor.name);
                                        }}
                                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
                                      >
                                        Mark as Donated
                                      </motion.button>
                                    )}
                                    {(donor.status === 'accepted' || donor.status === 'donated') && (
                                      <motion.a
                                        href={`tel:${donor.phone}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium"
                                      >
                                        Contact
                                      </motion.a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                            No donors have been assigned to your request yet.
                          </div>
                        )}
                      </div>
                      
                      {request.status === 'expired' && (
                        <div className="mt-4 text-center">
                          <p className="text-gray-500 dark:text-gray-400 mb-2">
                            This request has expired. Would you like to create a new one?
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateNewRequest}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm"
                          >
                            Create New Request
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RequestStatus;