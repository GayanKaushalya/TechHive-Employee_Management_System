// src/api/apiClient.js
import axios from 'axios';

// Create a new Axios instance
const apiClient = axios.create({
  // Set the base URL for all requests to our API Gateway
  baseURL: 'http://localhost:8080/api/v1',
});

// Use an "interceptor" to automatically add the JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // If the token exists, add the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default apiClient;