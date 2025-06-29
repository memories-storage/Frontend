import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import { ENDPOINTS } from '../../utils/constants/api';

// Async thunks for API calls
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINTS.USER_PROFILE);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.put(ENDPOINTS.UPDATE_PROFILE, userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update user profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await apiService.put(ENDPOINTS.CHANGE_PASSWORD, passwordData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to change password');
    }
  }
);

export const fetchUserProjects = createAsyncThunk(
  'user/fetchUserProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINTS.PROJECTS);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user projects');
    }
  }
);

const initialState = {
  profile: null,
  projects: [],
  loading: false,
  error: null,
  lastFetched: {
    profile: null,
    projects: null,
  },
  // Cache duration in milliseconds (5 minutes)
  cacheDuration: 5 * 60 * 1000,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.profile = null;
      state.projects = [];
      state.lastFetched = {
        profile: null,
        projects: null,
      };
      state.error = null;
    },
    updateProfileLocally: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    addProjectLocally: (state, action) => {
      state.projects.unshift(action.payload);
    },
    updateProjectLocally: (state, action) => {
      const { id, updates } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === id);
      if (projectIndex !== -1) {
        state.projects[projectIndex] = { ...state.projects[projectIndex], ...updates };
      }
    },
    removeProjectLocally: (state, action) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.lastFetched.profile = Date.now();
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.lastFetched.profile = Date.now();
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch User Projects
    builder
      .addCase(fetchUserProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.lastFetched.projects = Date.now();
        state.error = null;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserProjects = (state) => state.user.projects;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectLastFetched = (state) => state.user.lastFetched;
export const selectCacheDuration = (state) => state.user.cacheDuration;

// Helper function to check if data is stale
export const isDataStale = (lastFetched, cacheDuration) => {
  if (!lastFetched) return true;
  return Date.now() - lastFetched > cacheDuration;
};

// Helper function to check if profile data is fresh
export const selectIsProfileFresh = (state) => {
  const { lastFetched, cacheDuration } = state.user;
  return !isDataStale(lastFetched.profile, cacheDuration);
};

// Helper function to check if projects data is fresh
export const selectIsProjectsFresh = (state) => {
  const { lastFetched, cacheDuration } = state.user;
  return !isDataStale(lastFetched.projects, cacheDuration);
};

export const {
  clearUserData,
  updateProfileLocally,
  addProjectLocally,
  updateProjectLocally,
  removeProjectLocally,
} = userSlice.actions;

export default userSlice.reducer; 