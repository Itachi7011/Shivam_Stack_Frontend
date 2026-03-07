import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current admin profile
  const fetchAdmin = async () => {
    try {
      const response = await axios.get('/api/admin/profile', {
        withCredentials: true
      });
      setAdmin(response.data);
      setError(null);
    } catch (err) {
      setAdmin(null);
      // 401 is expected if not logged in
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Failed to fetch admin');
      }
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const adminLogin = async (email, password, twoFactorCode = null) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/admin/login', { 
        email, 
        password, 
        twoFactorCode 
      }, {
        withCredentials: true
      });
      
      setAdmin(response.data.admin);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed',
        requires2FA: err.response?.data?.requires2FA || false,
        attemptsRemaining: err.response?.data?.attemptsRemaining 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const adminLogout = async () => {
    try {
      setLoading(true);
      await axios.post('/api/admin/logout', {}, {
        withCredentials: true
      });
      
      setAdmin(null);
      setError(null);
    } catch (err) {
      console.error('Admin logout error:', err);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  // Check if admin has specific permission
  const hasPermission = (permission) => {
    if (!admin) return false;
    if (admin.role === 'superadmin') return true;
    return admin.permissions?.includes(permission) || false;
  };

  // Check if admin has all required permissions
  const hasAllPermissions = (permissions) => {
    if (!admin) return false;
    if (admin.role === 'superadmin') return true;
    return permissions.every(p => admin.permissions?.includes(p));
  };

  // Check auth status on mount
  useEffect(() => {
    fetchAdmin();
  }, []);

  // Add axios interceptor for handling 401 responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Check if it's an admin route
          if (error.config.url?.includes('/api/admin/')) {
            setAdmin(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    admin,
    loading,
    error,
    adminLogin,
    adminLogout,
    fetchAdmin,
    isAuthenticated: !!admin,
    isSuperAdmin: admin?.role === 'superadmin',
    hasPermission,
    hasAllPermissions
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};