// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for cookies (if you use httpOnly cookies)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token (if you store tokens in localStorage/session)
// If you rely solely on cookies (httpOnly), you may not need this.
api.interceptors.request.use(
  (config) => {
    // Check if we are on an admin route to decide which token to use
    // But we don't have access to router here. Simpler: let the server decide via cookies.
    // For socket we need token, but axios can rely on cookies if withCredentials is true.
    // However, your authentication middleware reads from cookies, so no need to set header.
    // If you store tokens in localStorage, you can add them here:
    // const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, 500)
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        // Unauthorized – redirect to login
        console.error('Unauthorized, redirecting to login');
        // You can use window.location or a redirect function passed from React
        // window.location.href = '/user/login';
      } else if (status === 403) {
        console.error('Forbidden:', data.message);
      } else if (status === 500) {
        console.error('Server error:', data.message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;