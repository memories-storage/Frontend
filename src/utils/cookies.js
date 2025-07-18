import Cookies from 'js-cookie';

// Cookie configuration
const COOKIE_CONFIG = {
  // Auth token cookie
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  USER_ID: 'userId',
  
  // Cookie options
  OPTIONS: {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    path: '/', // Available across the entire site
  },
  
  // Session cookie options (expires when browser closes)
  SESSION_OPTIONS: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  }
};

// Cookie utility functions
export const cookieUtils = {
  // Set authentication token
  setAuthToken: (token) => {
    if (token) {
      Cookies.set(COOKIE_CONFIG.AUTH_TOKEN, token, COOKIE_CONFIG.OPTIONS);
    }
  },

  // Get authentication token
  getAuthToken: () => {
    return Cookies.get(COOKIE_CONFIG.AUTH_TOKEN);
  },

  // Remove authentication token
  removeAuthToken: () => {
    Cookies.remove(COOKIE_CONFIG.AUTH_TOKEN, { path: '/' });
  },

  // Set refresh token
  setRefreshToken: (token) => {
    if (token) {
      Cookies.set(COOKIE_CONFIG.REFRESH_TOKEN, token, COOKIE_CONFIG.OPTIONS);
    }
  },

  // Get refresh token
  getRefreshToken: () => {
    return Cookies.get(COOKIE_CONFIG.REFRESH_TOKEN);
  },

  // Remove refresh token
  removeRefreshToken: () => {
    Cookies.remove(COOKIE_CONFIG.REFRESH_TOKEN, { path: '/' });
  },

  // Set user data
  setUserData: (userData) => {
    if (userData) {
      const userDataString = typeof userData === 'string' ? userData : JSON.stringify(userData);
      Cookies.set(COOKIE_CONFIG.USER_DATA, userDataString, COOKIE_CONFIG.OPTIONS);
    }
  },

  // Get user data
  getUserData: () => {
    const userData = Cookies.get(COOKIE_CONFIG.USER_DATA);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
    
        return null;
      }
    }
    return null;
  },

  // Remove user data
  removeUserData: () => {
    Cookies.remove(COOKIE_CONFIG.USER_DATA, { path: '/' });
  },

  // Set user ID
  setUserId: (userId) => {
    if (userId) {
      Cookies.set(COOKIE_CONFIG.USER_ID, userId, COOKIE_CONFIG.OPTIONS);
    }
  },

  // Get user ID
  getUserId: () => {
    return Cookies.get(COOKIE_CONFIG.USER_ID);
  },

  // Remove user ID
  removeUserId: () => {
    Cookies.remove(COOKIE_CONFIG.USER_ID, { path: '/' });
  },

  // Clear all auth cookies
  clearAuthCookies: () => {
    cookieUtils.removeAuthToken();
    cookieUtils.removeRefreshToken();
    cookieUtils.removeUserData();
    cookieUtils.removeUserId();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!cookieUtils.getAuthToken();
  },

  // Set session cookie (expires when browser closes)
  setSessionCookie: (name, value) => {
    if (value) {
      Cookies.set(name, value, COOKIE_CONFIG.SESSION_OPTIONS);
    }
  },

  // Get session cookie
  getSessionCookie: (name) => {
    return Cookies.get(name);
  },

  // Remove session cookie
  removeSessionCookie: (name) => {
    Cookies.remove(name, { path: '/' });
  }
};

export default cookieUtils; 