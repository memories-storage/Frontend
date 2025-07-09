import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import { ENDPOINTS } from '../../utils/constants/api';
import { cookieUtils } from '../../utils/cookies';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiService.post(ENDPOINTS.LOGIN, credentials);
      
      // Store tokens and user data in cookies
      if (response.accessToken) {
        cookieUtils.setAuthToken(response.accessToken);
      }
      if (response.refreshToken) {
        cookieUtils.setRefreshToken(response.refreshToken);
      }
      if (response.userId) {
        cookieUtils.setUserId(response.userId);
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.post(ENDPOINTS.REGISTER, userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Call logout endpoint to invalidate tokens on server
      await apiService.post(ENDPOINTS.LOGOUT);
      
      // Clear cookies
      cookieUtils.clearAuthCookies();
      
      return null;
    } catch (error) {
      // Even if server logout fails, clear local cookies
      cookieUtils.clearAuthCookies();
      return null;
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = cookieUtils.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiService.post(ENDPOINTS.REFRESH_TOKEN, {
        refreshToken,
      });
      
      // Update tokens in cookies
      if (response.accessToken) {
        cookieUtils.setAuthToken(response.accessToken);
      }
      if (response.refreshToken) {
        cookieUtils.setRefreshToken(response.refreshToken);
      }
      
      return response;
    } catch (error) {
      // Clear cookies on refresh failure
      cookieUtils.clearAuthCookies();
      return rejectWithValue(error.response?.data || 'Token refresh failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiService.post(ENDPOINTS.FORGOT_PASSWORD, { email });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Password reset request failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await apiService.post(ENDPOINTS.RESET_PASSWORD, resetData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Password reset failed');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: !!cookieUtils.getAuthToken(), // Initialize from cookies
  loading: false,
  error: null,
  tokenRefreshLoading: false,
  // Check if user is authenticated on app start
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const token = cookieUtils.getAuthToken();
      const userData = cookieUtils.getUserData();
      const userId = cookieUtils.getUserId();
      
      state.isAuthenticated = !!token;
      
      // If we have userData, use it; otherwise create user object from userId
      if (userData) {
        state.user = userData;
      } else if (userId) {
        // Create basic user object from userId if userData is not available
        state.user = {
          id: userId,
          // Other fields will be populated when user data is fetched
        };
      } else {
        state.user = null;
      }
      
      state.isInitialized = true;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuthData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Create user object with userId from backend response
        state.user = {
          id: action.payload.userID || action.payload.userId, // Try both field names
          email: action.payload.email,
          role: action.payload.role,
          // Add any other user fields that might be available
        };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.tokenRefreshLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.tokenRefreshLoading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.tokenRefreshLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAuthUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectTokenRefreshLoading = (state) => state.auth.tokenRefreshLoading;
export const selectIsAuthInitialized = (state) => state.auth.isInitialized;

export const {
  initializeAuth,
  clearAuthError,
  setUser,
  clearAuthData,
} = authSlice.actions;

export default authSlice.reducer; 