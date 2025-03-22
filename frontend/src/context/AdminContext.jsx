import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  isAdminAuthenticated, 
  getAdminInfo, 
  loginAdmin, 
  registerAdmin, 
  logoutAdmin 
} from '../services/adminService';

export const AdminContext = createContext();

// Auto-logout after 15 minutes of inactivity
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inactivityTimer, setInactivityTimer] = useState(null);

  // Function to logout admin
  const logout = useCallback(() => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
    logoutAdmin();
    setAdmin(null);
  }, [inactivityTimer]);

  // Function to reset the inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    if (admin) {
      const timer = setTimeout(() => {
        console.log('Admin session expired due to inactivity');
        logout();
      }, INACTIVITY_TIMEOUT);
      
      setInactivityTimer(timer);
    }
  }, [admin, inactivityTimer, logout]);

  // Setup event listeners to detect user activity
  useEffect(() => {
    if (admin) {
      // Set up activity listeners
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      
      const activityHandler = () => {
        resetInactivityTimer();
      };
      
      // Add event listeners
      activityEvents.forEach(event => {
        window.addEventListener(event, activityHandler);
      });
      
      // Set initial timer
      resetInactivityTimer();
      
      // Cleanup event listeners
      return () => {
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
        
        activityEvents.forEach(event => {
          window.removeEventListener(event, activityHandler);
        });
      };
    }
  }, [admin, resetInactivityTimer, inactivityTimer]);
  
  // Check for page visibility changes (when tab/window is closed or hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && admin) {
        // When page is hidden (tab closed or switched), set a shorter timer
        const timer = setTimeout(() => {
          console.log('Admin logged out due to page being hidden');
          logout();
        }, 60000); // 1 minute after tab is hidden/closed
        setInactivityTimer(timer);
      } else if (document.visibilityState === 'visible' && admin) {
        // Reset timer when page becomes visible again
        resetInactivityTimer();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [admin, logout, resetInactivityTimer]);

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
      resetInactivityTimer(); // Start the inactivity timer
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
      resetInactivityTimer(); // Start the inactivity timer
      return true;
    } catch (error) {
      setError(error.error || 'Failed to register');
      setLoading(false);
      return false;
    }
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