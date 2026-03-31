// Create a file: src/config/api.js
export const getApiBase = () => {
  // Check if we're in production (Netlify)
  const isProduction = window.location.hostname.includes('netlify.app') || 
                       process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return 'https://shivam-stack-backend.onrender.com/api/public/projects';
  }
  
  // Development - use relative URL
  return '/api/public/projects';
};