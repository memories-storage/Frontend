import { cookieUtils } from './cookies';

// Authentication utility functions
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return cookieUtils.isAuthenticated();
  },

  // Get current user data
  getCurrentUser: () => {
    return cookieUtils.getUserData();
  },

  // Get auth token
  getAuthToken: () => {
    return cookieUtils.getAuthToken();
  },

  // Logout user
  logout: () => {
    // Clear all auth cookies
    cookieUtils.clearAuthCookies();
    
    // Redirect to login page
    window.location.href = '/login';
  },

  // Check if token is expired (basic check)
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      // Decode JWT token (without verification for client-side check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp < currentTime;
    } catch (error) {
  
      return true;
    }
  },

  // Refresh authentication state
  refreshAuthState: () => {
    const token = cookieUtils.getAuthToken();
    
    if (token && authUtils.isTokenExpired(token)) {
      // Token is expired, logout user
      authUtils.logout();
      return false;
    }
    
    return !!token;
  },

  // Set authentication data
  setAuthData: (token, userData = null) => {
    if (token) {
      cookieUtils.setAuthToken(token);
    }
    
    if (userData) {
      cookieUtils.setUserData(userData);
    }
  },

  // Clear authentication data
  clearAuthData: () => {
    cookieUtils.clearAuthCookies();
  }
};

export default authUtils; 