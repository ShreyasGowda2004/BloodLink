import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaTint, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaClipboardList } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [donorData, setDonorData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch donor profile data
        const donorResponse = await api.get('/donors/profile');
        setDonorData(donorResponse.data);
        
        // Fetch blood requests
        const requestsResponse = await api.get('/requests');
        setRequests(requestsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center text-red-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Donor Dashboard
      </motion.h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4 bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-red-600 text-white' : 'text-gray-700'}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser className="inline mr-2" /> Profile
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'donations' ? 'bg-red-600 text-white' : 'text-gray-700'}`}
            onClick={() => setActiveTab('donations')}
          >
            <FaTint className="inline mr-2" /> Donations
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'requests' ? 'bg-red-600 text-white' : 'text-gray-700'}`}
            onClick={() => setActiveTab('requests')}
          >
            <FaClipboardList className="inline mr-2" /> Requests
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2"><FaUser className="inline mr-2" /> Name</p>
                <p className="font-medium">{user?.name || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2"><FaTint className="inline mr-2" /> Blood Type</p>
                <p className="font-medium">{donorData?.bloodType || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2"><FaCalendarAlt className="inline mr-2" /> Date of Birth</p>
                <p className="font-medium">{donorData?.dateOfBirth ? new Date(donorData.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2"><FaMapMarkerAlt className="inline mr-2" /> Address</p>
                <p className="font-medium">{donorData?.address || 'Not provided'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2"><FaPhone className="inline mr-2" /> Phone</p>
                <p className="font-medium">{donorData?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Donation History</h2>
            {donorData?.donations && donorData.donations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (ml)</th>
                      <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donorData.donations.map((donation, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-4 px-4 border-b border-gray-200">{new Date(donation.date).toLocaleDateString()}</td>
                        <td className="py-4 px-4 border-b border-gray-200">{donation.location}</td>
                        <td className="py-4 px-4 border-b border-gray-200">{donation.amount}</td>
                        <td className="py-4 px-4 border-b border-gray-200">
                          <span className={`px-2 py-1 rounded-full text-xs ${donation.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No donation history available.</p>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Blood Requests</h2>
            {requests && requests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                      <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                      <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                      <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-4 px-4 border-b border-gray-200">{new Date(request.date).toLocaleDateString()}</td>
                        <td className="py-4 px-4 border-b border-gray-200">{request.bloodType}</td>
                        <td className="py-4 px-4 border-b border-gray-200">{request.hospital}</td>
                        <td className="py-4 px-4 border-b border-gray-200">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.urgency === 'High' ? 'bg-red-100 text-red-800' : 
                            request.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {request.urgency}
                          </span>
                        </td>
                        <td className="py-4 px-4 border-b border-gray-200">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'Fulfilled' ? 'bg-green-100 text-green-800' : 
                            request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No blood requests available.</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
