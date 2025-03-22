import api from './api';

// Register new admin
export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post('/admin/register', adminData);
    
    // Store token in local storage
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Could not register admin');
  }
};

// Login admin
export const loginAdmin = async (credentials) => {
  try {
    const response = await api.post('/admin/login', credentials);
    
    // Store token in local storage
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      throw error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw { error: 'No response from server. Please try again later.' };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      throw { error: 'Could not login. Please try again.' };
    }
  }
};

// Get admin dashboard data
export const getDashboardData = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await api.get('/admin/dashboard', {
      headers: {
        'x-auth-token': token
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Could not fetch dashboard data');
  }
};

// Get all donors
export const getAllDonors = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await api.get('/admin/donors', {
      headers: {
        'x-auth-token': token
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Could not fetch donors');
  }
};

// Get all blood requests
export const getAllRequests = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await api.get('/admin/requests', {
      headers: {
        'x-auth-token': token
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Could not fetch blood requests');
  }
};

// Logout admin
export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
  return { success: true };
};

// Check if admin is authenticated
export const isAdminAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// Get admin info from local storage
export const getAdminInfo = () => {
  const adminInfo = localStorage.getItem('adminInfo');
  return adminInfo ? JSON.parse(adminInfo) : null;
}; 