import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { getDonorRequests, updateRequestStatus, getDonorById } from '../services/donorService';

const DonorDashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [donor, setDonor] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [bloodRequests, setBloodRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState({ requestId: null, status: null });
  
  useEffect(() => {
    // Check if user is logged in
    const donorData = localStorage.getItem('donor');
    
    if (!donorData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedDonor = JSON.parse(donorData);
      setDonor(parsedDonor);
    } catch (error) {
      console.error('Error parsing donor data:', error);
      navigate('/login');
    }
    
    // Fetch blood requests
    fetchBloodRequests();
  }, [navigate]);
  
  const fetchBloodRequests = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const donorData = JSON.parse(localStorage.getItem('donor'));
      if (!donorData?._id) {
        throw new Error('Donor ID not found');
      }
      
      const response = await getDonorRequests(donorData._id);
      
      if (response.success) {
        setBloodRequests(response.data || []);
        // Count new pending requests
        const newRequests = (response.data || []).filter(req => req.status === 'pending').length;
        setNewRequestsCount(newRequests);
        
        // Get the latest donor information to ensure donation count is up to date
        try {
          const donorResponse = await getDonorById(donorData._id);
          
          if (donorResponse.success) {
            // Update donor data in state and localStorage
            setDonor(donorResponse.data);
            localStorage.setItem('donor', JSON.stringify(donorResponse.data));
            console.log('Updated donor data with current donation count:', donorResponse.data.donationCount);
          }
        } catch (donorError) {
          console.error('Error refreshing donor data:', donorError);
        }
      } else {
        setError(response.error || 'Failed to fetch blood requests');
      }
    } catch (error) {
      console.error('Error fetching blood requests:', error);
      setError('Failed to fetch blood requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateRequestStatus = async (requestId, status) => {
    try {
      if (!donor?._id) return;
      
      // If it's an acceptance action, show confirmation first
      if (status === 'accepted') {
        setPendingAction({ requestId, status });
        setShowConfirmation(true);
        return;
      }
      
      const response = await updateRequestStatus(donor._id, requestId, status);
      
      if (response.success) {
        // Update local state
        setBloodRequests(prevRequests => 
          prevRequests.map(req => 
            req.requestId?._id === requestId ? { ...req, status } : req
          )
        );
        
        // Recalculate pending requests count
        const newRequests = bloodRequests
          .filter(req => req.requestId?._id !== requestId || (req.requestId?._id === requestId && status === 'pending'))
          .filter(req => req.status === 'pending').length;
        setNewRequestsCount(newRequests);
      } else {
        setError(response.error || `Failed to ${status} request`);
      }
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      setError(`Failed to ${status} request. Please try again.`);
    }
  };
  
  const confirmAction = async () => {
    if (pendingAction.requestId && pendingAction.status) {
      const { requestId, status } = pendingAction;
      const response = await updateRequestStatus(donor._id, requestId, status);
      
      if (response.success) {
        // Update local state
        setBloodRequests(prevRequests => 
          prevRequests.map(req => 
            req.requestId?._id === requestId ? { ...req, status } : req
          )
        );
        
        // Recalculate pending requests count
        const newRequests = bloodRequests
          .filter(req => req.requestId?._id !== requestId || (req.requestId?._id === requestId && status === 'pending'))
          .filter(req => req.status === 'pending').length;
        setNewRequestsCount(newRequests);
      } else {
        setError(response.error || `Failed to ${status} request`);
      }
    }
    
    // Clear the pending action
    setPendingAction({ requestId: null, status: null });
    setShowConfirmation(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('donor');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };
  
  if (!donor) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <p>Please wait while we load your dashboard</p>
        </div>
      </div>
    );
  }
  
  const renderProfile = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Name</p>
            <p className="font-medium">{donor.name}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Age</p>
            <p className="font-medium">{donor.age}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Gender</p>
            <p className="font-medium">{donor.gender}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Blood Type</p>
            <p className="font-medium text-red-600">{donor.bloodType}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Phone</p>
            <p className="font-medium">{donor.phone}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Last Donation</p>
            <p className="font-medium">
              {donor.lastDonation === 'never' 
                ? 'Never donated before' 
                : donor.lastDonation === 'less_than_3_months'
                  ? 'Less than 3 months ago'
                  : 'More than 3 months ago'
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <h3 className="text-xl font-semibold mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Country</p>
            <p className="font-medium">{donor.country}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">State</p>
            <p className="font-medium">{donor.state}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">City</p>
            <p className="font-medium">{donor.city}</p>
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <h3 className="text-xl font-semibold mb-4">Donation Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-2xl font-bold">{donor.donationCount || 0}</p>
            <p className="text-gray-500 dark:text-gray-400">Total Donations</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-2xl font-bold">{bloodRequests.filter(r => r.status === 'accepted' || r.status === 'donated').length}</p>
            <p className="text-gray-500 dark:text-gray-400">Accepted Requests</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="text-2xl font-bold">
              {donor.lastDonation === 'less_than_3_months' ? 'No' : 'Yes'}
            </p>
            <p className="text-gray-500 dark:text-gray-400">Eligible to Donate</p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
  
  const renderRequests = () => (
    <div className="space-y-6">
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md mx-4`}
          >
            <h3 className="text-xl font-semibold mb-4">Confirm Blood Donation</h3>
            <p className="mb-6">Are you sure you want to accept this blood donation request? The requester will be notified of your commitment.</p>
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmAction}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Yes, Accept
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading requests...</p>
        </div>
      ) : bloodRequests.length === 0 ? (
        <div className="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">You have no blood donation requests at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bloodRequests.map((request, index) => (
            <motion.div
              key={request.requestId?._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } shadow-sm relative`}
            >
              {/* Notification dot for pending requests */}
              {request.status === 'pending' && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div className="mb-4 md:mb-0">
                  <h4 className="font-semibold">{request.requestId?.name || 'Unknown Requester'}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-red-600 font-medium">{request.requestId?.bloodType || 'Unknown'}</span>
                    {request.requestId?.urgency && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        request.requestId.urgency === 'emergency' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : request.requestId.urgency === 'urgent'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {request.requestId.urgency.charAt(0).toUpperCase() + request.requestId.urgency.slice(1)}
                      </span>
                    )}
                  </p>
                  
                  {/* Contact information with call button */}
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Phone:</span>
                    <span className="text-sm font-medium">{request.requestId?.phone || 'N/A'}</span>
                    {request.requestId?.phone && (
                      <a 
                        href={`tel:${request.requestId.phone}`}
                        className="ml-2 p-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 rounded-full"
                        title="Call Requester"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </a>
                    )}
                  </div>
                  
                  {/* Location with map link */}
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Location:</span>
                    <span className="text-sm">{request.requestId?.city || 'N/A'}, {request.requestId?.state || 'N/A'}</span>
                    {request.requestId?.city && request.requestId?.state && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${request.requestId.city}, ${request.requestId.state}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 p-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                        title="View on Map"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </a>
                    )}
                  </div>
                  
                  {request.requestId?.reason && (
                    <p className="text-sm mt-2">
                      <span className="text-gray-500 dark:text-gray-400">Reason: </span>
                      {request.requestId.reason}
                    </p>
                  )}
                </div>
                
                <div>
                  {request.status === 'pending' ? (
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpdateRequestStatus(request.requestId?._id, 'accepted')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                      >
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpdateRequestStatus(request.requestId?._id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                      >
                        Decline
                      </motion.button>
                    </div>
                  ) : request.status === 'accepted' ? (
                    <div className="px-4 py-2 rounded-lg text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Accepted
                    </div>
                  ) : request.status === 'donated' ? (
                    <div className="px-4 py-2 rounded-lg text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Donated
                    </div>
                  ) : (
                    <div className="px-4 py-2 rounded-lg text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Declined
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
  
  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Donor Dashboard</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Welcome, <span className="font-medium">{donor.name}</span>
            </div>
          </div>
          
          <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-4 py-2 mr-2 ${
                activeTab === 'profile'
                  ? 'border-b-2 border-red-500 font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-4 py-2 mr-2 relative ${
                activeTab === 'requests'
                  ? 'border-b-2 border-red-500 font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              Blood Requests
              {newRequestsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {newRequestsCount}
                </span>
              )}
            </button>
          </div>
          
          {activeTab === 'profile' ? renderProfile() : renderRequests()}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard; 