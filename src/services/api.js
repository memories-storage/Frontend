import axios from 'axios';
import { API_BASE_URL, DEFAULT_HEADERS, API_TIMEOUT } from '../utils/constants/api';
import { cookieUtils } from '../utils/cookies';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = cookieUtils.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear cookies and redirect to login
          cookieUtils.clearAuthCookies();
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - show access denied message
          break;
        case 404:
          // Not found
          break;
        case 500:
          // Server error
          break;
        default:
          // Handle other errors
      }
    } else if (error.request) {
      // Network error
    } else {
      // Other error
    }
    
    return Promise.reject(error);
  }
);

// API helper functions
export const apiService = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST form data
  postForm: async (url, formData, config = {}) => {
    try {
      const response = await api.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload file
  upload: async (url, file, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress,
      };
      
      const response = await api.post(url, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api; 