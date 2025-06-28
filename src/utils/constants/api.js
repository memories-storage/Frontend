// API Base URLs
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// API Endpoints
export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User endpoints
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile/update',
  
  // Project endpoints
  PROJECTS: '/projects',
  PROJECT_DETAILS: (id) => `/projects/${id}`,
  PROJECT_MEMBERS: (id) => `/projects/${id}/members`,
  
  // Code endpoints
  CODE_FILES: '/code/files',
  CODE_EXECUTE: '/code/execute',
  CODE_SAVE: '/code/save',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Request Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// API Timeout
export const API_TIMEOUT = 30000; // 30 seconds 