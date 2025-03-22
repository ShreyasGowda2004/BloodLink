import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { ThemeContext } from '../context/ThemeContext';
import { getDashboardData, getAllDonors, getAllRequests } from '../services/adminService';
import { FaUsers, FaTint, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaHospital, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { admin, logout, isAuthenticated } = useContext(AdminContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all required data
        const dashboardResponse = await getDashboardData();
        const donorsResponse = await getAllDonors();
        const requestsResponse = await getAllRequests();
        
        setDashboardData(dashboardResponse);
        setDonors(donorsResponse);
        setRequests(requestsResponse);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError(error.message || 'Failed to fetch data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
      case 'donated':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'rejected':
      case 'expired':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const formatLocation = (location) => {
    if (!location) return 'Not provided';
    if (typeof location === 'object' && location.coordinates) {
      return `${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`;
    }
    return String(location);
  };
  
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Donors Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <FaUsers size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Donors</h3>
            <p className="text-3xl font-bold">{dashboardData?.donors.total || 0}</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Blood Type Distribution</h4>
          <div className="grid grid-cols-4 gap-2">
            {dashboardData?.donors.bloodTypeDistribution.map((type) => (
              <div key={type._id} className={`text-center p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-lg font-bold text-red-600">{type._id}</p>
                <p className="text-sm">{type.count}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Blood Requests Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <FaTint size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Blood Requests</h3>
            <p className="text-3xl font-bold">{dashboardData?.requests.total || 0}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center">
              <FaExclamationCircle className="text-yellow-500 mr-2" />
              <span>Pending</span>
            </div>
            <p className="text-xl font-bold mt-1">{dashboardData?.requests.pending || 0}</p>
          </div>
          
          <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              <span>Fulfilled</span>
            </div>
            <p className="text-xl font-bold mt-1">{dashboardData?.requests.fulfilled || 0}</p>
          </div>
          
          <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center">
              <FaTimesCircle className="text-red-500 mr-2" />
              <span>Rejected</span>
            </div>
            <p className="text-xl font-bold mt-1">{dashboardData?.requests.rejected || 0}</p>
          </div>
          
          <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center">
              <FaTimesCircle className="text-gray-500 mr-2" />
              <span>Expired</span>
            </div>
            <p className="text-xl font-bold mt-1">{dashboardData?.requests.expired || 0}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Donations Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <FaHospital size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Donations</h3>
            <p className="text-3xl font-bold">{dashboardData?.donations.completed || 0}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center">
              <FaCheckCircle className="text-yellow-500 mr-2" />
              <span>Accepted</span>
            </div>
            <p className="text-xl font-bold mt-1">{dashboardData?.donations.accepted || 0}</p>
          </div>
          
          <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              <span>Completed</span>
            </div>
            <p className="text-xl font-bold mt-1">{dashboardData?.donations.completed || 0}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500" 
              style={{ 
                width: `${dashboardData?.donations.completed > 0 
                  ? (dashboardData?.donations.completed / (dashboardData?.donations.accepted + dashboardData?.donations.completed)) * 100 
                  : 0}%` 
              }}
            ></div>
          </div>
          <p className="text-sm mt-2">
            {dashboardData?.donations.completed || 0} of {(dashboardData?.donations.accepted || 0) + (dashboardData?.donations.completed || 0)} accepted donations completed
          </p>
        </div>
      </motion.div>
    </div>
  );
  
  const renderDonorsTable = () => (
    <div className={`mt-6 overflow-hidden rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Blood Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Registered On</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {donors.length > 0 ? (
              donors.map((donor) => (
                <tr key={donor._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{donor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{donor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{donor.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {donor.bloodType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatLocation(donor.location)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(donor.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">No donors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const renderRequestsTable = () => (
    <div className={`mt-6 overflow-hidden rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Patient Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Blood Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Units</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hospital</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created On</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Donors</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{request.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {request.bloodType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.unitsNeeded}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.hospitalName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.donorRequests.some(dr => dr.status === 'accepted' || dr.status === 'donated')
                        ? 'bg-green-100 text-green-800'
                        : request.donorRequests.every(dr => dr.status === 'rejected')
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.donorRequests.some(dr => dr.status === 'accepted' || dr.status === 'donated')
                        ? 'Fulfilled'
                        : request.donorRequests.every(dr => dr.status === 'rejected')
                          ? 'Rejected'
                          : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(request.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span>
                      {request.donorRequests.length > 0 ? (
                        <div>
                          {request.donorRequests.map((donorRequest, index) => (
                            <div key={index} className="flex items-center mb-1">
                              <span className={`mr-2 ${getStatusColor(donorRequest.status)}`}>•</span>
                              <span>{donorRequest.donor?.name || 'Unknown'} - </span>
                              <span className={`ml-1 ${getStatusColor(donorRequest.status)}`}>
                                {donorRequest.status.charAt(0).toUpperCase() + donorRequest.status.slice(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        'No donors assigned'
                      )}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">No requests found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-xl">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <div className="text-center max-w-md p-8 rounded-lg shadow-lg bg-white">
          <div className="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Header */}
      <header className={`py-6 px-6 md:px-10 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <FaTint className="text-red-600 mr-3" size={28} />
            <h1 className="text-2xl font-bold">BloodLink Admin</h1>
          </div>
          
          <div className="flex items-center">
            <div className="mr-6">
              <p className="text-sm">Welcome,</p>
              <p className="font-medium">{admin?.name || 'Admin'}</p>
            </div>
            
            <button 
              onClick={handleLogout}
              className={`flex items-center px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors`}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 md:px-10 py-8">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-6 font-medium ${
              activeTab === 'dashboard' 
                ? darkMode 
                  ? 'border-b-2 border-red-600 text-red-600' 
                  : 'border-b-2 border-red-600 text-red-600'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('donors')}
            className={`py-3 px-6 font-medium ${
              activeTab === 'donors' 
                ? darkMode 
                  ? 'border-b-2 border-red-600 text-red-600' 
                  : 'border-b-2 border-red-600 text-red-600'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Donors List
          </button>
          
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-3 px-6 font-medium ${
              activeTab === 'requests' 
                ? darkMode 
                  ? 'border-b-2 border-red-600 text-red-600' 
                  : 'border-b-2 border-red-600 text-red-600'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Blood Requests
          </button>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'dashboard' && dashboardData && renderDashboard()}
        {activeTab === 'donors' && renderDonorsTable()}
        {activeTab === 'requests' && renderRequestsTable()}
      </main>
    </div>
  );
};

export default AdminDashboard; 