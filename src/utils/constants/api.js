// API Base URLs
// export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
// export const API_BASE_URL = `${process.env.REACT_APP_API_URL}api`;
export const API_BASE_URL = `${process.env.REACT_APP_API_URL}api` || 'http://localhost:8080/api';

// API Endpoints
export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/login',
  REGISTER: '/signup',
  LOGOUT: '/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/forgot-password',
  RESEND_RESET_EMAIL: '/resend-reset-email',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User endpoints
  USERS: '/users',
  USER_PROFILE: '/getUserData',
  UPDATE_PROFILE: '/users/profile/update',
  CHANGE_PASSWORD: '/users/change-password',
  
  // Project endpoints
  PROJECTS: '/projects',
  PROJECT_DETAILS: (id) => `/projects/${id}`,
  PROJECT_MEMBERS: (id) => `/projects/${id}/members`,

  // File upload
  UPLOAD_FILES: '/upload/files',
  
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
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// Request Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// API Timeout
export const API_TIMEOUT = 30000; // 30 seconds 