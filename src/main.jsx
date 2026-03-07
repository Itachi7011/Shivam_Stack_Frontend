import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import axios from "axios";

// Set base URL for all axios requests
axios.defaults.baseURL =
  import.meta.env.VITE_NODE_ENV === "deployment"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL || "http://localhost:5000";

axios.defaults.withCredentials = true; // Important for cookies
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Log axios config for debugging (remove in production)
console.log('Axios configured with:', {
  baseURL: axios.defaults.baseURL,
  withCredentials: axios.defaults.withCredentials
});
axios.interceptors.request.use(request => {
  console.log('📤 Request:', {
    url: request.url,
    method: request.method,
    withCredentials: request.withCredentials,
    cookies: document.cookie // This will be empty (HttpOnly), but we can check headers
  });
  
  // Check if cookies are in the request headers (they won't show here for security)
  return request;
});

axios.interceptors.response.use(response => {
  console.log('📥 Response:', {
    url: response.config.url,
    status: response.status,
    headers: response.headers
  });
  return response;
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
