import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Remove hasAuthCookie function entirely since httpOnly cookies aren't accessible via JS
// In AuthContext.jsx, update the fetchUser function:

const fetchUser = async () => {
  console.log('🟡 fetchUser called');
  console.log('🟡 Current cookies:', document.cookie);
  
  try {
    console.log('🟡 Making API call to /api/users/profile');
    const response = await axios.get('/api/users/profile', {
      withCredentials: true
    });
    console.log('🟢 API Response:', response);
    console.log('🟢 User data:', response.data);
    setUser(response.data);
    setError(null);
  } catch (err) {
    console.log('🔴 API Error:', err);
    console.log('🔴 Error response:', err.response);
    console.log('🔴 Error status:', err.response?.status);
    console.log('🔴 Error data:', err.response?.data);
    setUser(null);
    if (err.response?.status !== 401) {
      setError(err.response?.data?.message || 'Failed to fetch user');
    }
  } finally {
    console.log('🟡 Setting loading to false');
    setLoading(false);
  }
};

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/login', { email, password }, {
        withCredentials: true
      });
      
      setUser(response.data.user);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed',
        attemptsRemaining: err.response?.data?.attemptsRemaining 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      Object.keys(userData).forEach(key => {
        if (key === 'avatar' && userData[key] instanceof File) {
          formData.append('avatar', userData[key]);
        } else if (key === 'preferences') {
          formData.append('preferences', JSON.stringify(userData[key]));
        } else if (userData[key] !== undefined && userData[key] !== null) {
          formData.append(key, userData[key]);
        }
      });

      const response = await axios.post('/api/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Registration failed',
        errors: err.response?.data?.errors 
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify email with OTP
  const verifyEmail = async (email, otp) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/verify-email', { email, otp }, {
        withCredentials: true
      });
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Email verification failed');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Resend verification OTP
  const resendVerification = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/resend-verification', { email }, {
        withCredentials: true
      });
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post('/api/users/logout', {}, {
        withCredentials: true
      });
      
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    fetchUser();
  }, []); // Remove interval - it's not needed

  // Add axios interceptor for handling 401 responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    fetchUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export context for use in the hook
export { AuthContext };

