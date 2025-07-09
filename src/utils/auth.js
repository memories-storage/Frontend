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

  // Get current user ID
  getCurrentUserId: () => {
    return cookieUtils.getUserId();
  },

  // Get current user ID with fallback to user object
  getUserId: (userObject = null) => {
    // First try to get from user object if provided
    if (userObject?.id || userObject?.userId) {
      return userObject.id || userObject.userId;
    }
    
    // Then try to get from cookies
    return cookieUtils.getUserId();
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
      // Also store userId separately for easy access
      if (userData.id || userData.userId) {
        const userId = userData.id || userData.userId;
        cookieUtils.setUserId(userId);
      }
    }
  },

  // Clear authentication data
  clearAuthData: () => {
    cookieUtils.clearAuthCookies();
  }
};

export default authUtils; 