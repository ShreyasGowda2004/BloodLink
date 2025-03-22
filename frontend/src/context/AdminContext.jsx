import React, { createContext, useState, useEffect } from 'react';
import { 
  isAdminAuthenticated, 
  getAdminInfo, 
  loginAdmin, 
  registerAdmin, 
  logoutAdmin 
} from '../services/adminService';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if admin is already logged in
    if (isAdminAuthenticated()) {
      setAdmin(getAdminInfo());
    }
    setLoading(false);
  }, []);

  // Login admin
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const data = await loginAdmin(credentials);
      setAdmin(data.admin);
      setLoading(false);
      return true;
    } catch (error) {
      setError(error.error || 'Failed to login');
      setLoading(false);
      return false;
    }
  };

  // Register admin
  const register = async (adminData) => {
    try {
      setError(null);
      setLoading(true);
      const data = await registerAdmin(adminData);
      setAdmin(data.admin);
      setLoading(false);
      return true;
    } catch (error) {
      setError(error.error || 'Failed to register');
      setLoading(false);
      return false;
    }
  };

  // Logout admin
  const logout = () => {
    logoutAdmin();
    setAdmin(null);
  };

  // Clear error
  const clearError = () => setError(null);

  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        isAuthenticated: !!admin
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}; 