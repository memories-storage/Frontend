import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import { ENDPOINTS } from '../../utils/constants/api';

// Async thunks for project operations
export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINTS.PROJECTS);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  'project/fetchProjectDetails',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINTS.PROJECT_DETAILS(projectId));
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch project details');
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await apiService.post(ENDPOINTS.PROJECTS, projectData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(ENDPOINTS.PROJECT_DETAILS(projectId), projectData);
      return { projectId, data: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await apiService.delete(ENDPOINTS.PROJECT_DETAILS(projectId));
      return projectId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete project');
    }
  }
);

export const fetchProjectMembers = createAsyncThunk(
  'project/fetchProjectMembers',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINTS.PROJECT_MEMBERS(projectId));
      return { projectId, members: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch project members');
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  projectMembers: {},
  loading: false,
  error: null,
  lastFetched: {
    projects: null,
    currentProject: null,
  },
  cacheDuration: 10 * 60 * 1000, // 10 minutes
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearProjectData: (state) => {
      state.projects = [];
      state.currentProject = null;
      state.projectMembers = {};
      state.lastFetched = {
        projects: null,
        currentProject: null,
      };
      state.error = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
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
      
      if (state.currentProject && state.currentProject.id === id) {
        state.currentProject = { ...state.currentProject, ...updates };
      }
    },
    removeProjectLocally: (state, action) => {
      const projectId = action.payload;
      state.projects = state.projects.filter(project => project.id !== projectId);
      
      if (state.currentProject && state.currentProject.id === projectId) {
        state.currentProject = null;
      }
      
      delete state.projectMembers[projectId];
    },
    addProjectMemberLocally: (state, action) => {
      const { projectId, member } = action.payload;
      if (!state.projectMembers[projectId]) {
        state.projectMembers[projectId] = [];
      }
      state.projectMembers[projectId].push(member);
    },
    removeProjectMemberLocally: (state, action) => {
      const { projectId, memberId } = action.payload;
      if (state.projectMembers[projectId]) {
        state.projectMembers[projectId] = state.projectMembers[projectId].filter(
          member => member.id !== memberId
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.lastFetched.projects = Date.now();
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Project Details
    builder
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
        state.lastFetched.currentProject = Date.now();
        state.error = null;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Project
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const { projectId, data } = action.payload;
        
        const projectIndex = state.projects.findIndex(project => project.id === projectId);
        if (projectIndex !== -1) {
          state.projects[projectIndex] = data;
        }
        
        if (state.currentProject && state.currentProject.id === projectId) {
          state.currentProject = data;
        }
        
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        const projectId = action.payload;
        
        state.projects = state.projects.filter(project => project.id !== projectId);
        
        if (state.currentProject && state.currentProject.id === projectId) {
          state.currentProject = null;
        }
        
        delete state.projectMembers[projectId];
        
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Project Members
    builder
      .addCase(fetchProjectMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectMembers.fulfilled, (state, action) => {
        state.loading = false;
        const { projectId, members } = action.payload;
        state.projectMembers[projectId] = members;
        state.error = null;
      })
      .addCase(fetchProjectMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectProjects = (state) => state.project.projects;
export const selectCurrentProject = (state) => state.project.currentProject;
export const selectProjectMembers = (state) => state.project.projectMembers;
export const selectProjectLoading = (state) => state.project.loading;
export const selectProjectError = (state) => state.project.error;
export const selectProjectLastFetched = (state) => state.project.lastFetched;
export const selectProjectCacheDuration = (state) => state.project.cacheDuration;

export const selectProjectMembersById = (state, projectId) => 
  state.project.projectMembers[projectId] || [];

const isDataStale = (lastFetched, cacheDuration) => {
  if (!lastFetched) return true;
  return Date.now() - lastFetched > cacheDuration;
};

export const selectIsProjectsFresh = (state) => {
  const { lastFetched, cacheDuration } = state.project;
  return !isDataStale(lastFetched.projects, cacheDuration);
};

export const selectIsCurrentProjectFresh = (state) => {
  const { lastFetched, cacheDuration } = state.project;
  return !isDataStale(lastFetched.currentProject, cacheDuration);
};

export const {
  clearProjectData,
  setCurrentProject,
  clearCurrentProject,
  addProjectLocally,
  updateProjectLocally,
  removeProjectLocally,
  addProjectMemberLocally,
  removeProjectMemberLocally,
} = projectSlice.actions;

export default projectSlice.reducer; 