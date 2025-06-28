import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUserProfile, 
  fetchUserProjects,
  selectUserProfile,
  selectUserProjects,
  selectUserLoading,
  selectUserError,
  selectIsProfileFresh,
  selectIsProjectsFresh
} from '../store/slices/userSlice';
import {
  fetchProjects,
  fetchProjectDetails,
  selectProjects,
  selectCurrentProject,
  selectProjectLoading,
  selectProjectError,
  selectIsProjectsFresh as selectIsProjectListFresh,
  selectIsCurrentProjectFresh
} from '../store/slices/projectSlice';

// Hook for fetching user profile with caching
export const useUserProfile = (forceRefresh = false) => {
  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const isFresh = useSelector(selectIsProfileFresh);

  const fetchProfile = useCallback(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile || !isFresh || forceRefresh) {
      fetchProfile();
    }
  }, [profile, isFresh, forceRefresh, fetchProfile]);

  return {
    profile,
    loading,
    error,
    isFresh,
    refetch: fetchProfile
  };
};

// Hook for fetching user projects with caching
export const useUserProjects = (forceRefresh = false) => {
  const dispatch = useDispatch();
  const projects = useSelector(selectUserProjects);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const isFresh = useSelector(selectIsProjectsFresh);

  const fetchProjects = useCallback(() => {
    dispatch(fetchUserProjects());
  }, [dispatch]);

  useEffect(() => {
    if (!projects.length || !isFresh || forceRefresh) {
      fetchProjects();
    }
  }, [projects.length, isFresh, forceRefresh, fetchProjects]);

  return {
    projects,
    loading,
    error,
    isFresh,
    refetch: fetchProjects
  };
};

// Hook for fetching all projects with caching
export const useProjects = (forceRefresh = false) => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);
  const error = useSelector(selectProjectError);
  const isFresh = useSelector(selectIsProjectListFresh);

  const fetchProjectsList = useCallback(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (!projects.length || !isFresh || forceRefresh) {
      fetchProjectsList();
    }
  }, [projects.length, isFresh, forceRefresh, fetchProjectsList]);

  return {
    projects,
    loading,
    error,
    isFresh,
    refetch: fetchProjectsList
  };
};

// Hook for fetching specific project details with caching
export const useProjectDetails = (projectId, forceRefresh = false) => {
  const dispatch = useDispatch();
  const currentProject = useSelector(selectCurrentProject);
  const loading = useSelector(selectProjectLoading);
  const error = useSelector(selectProjectError);
  const isFresh = useSelector(selectIsCurrentProjectFresh);

  const fetchProjectDetails = useCallback(() => {
    if (projectId) {
      dispatch(fetchProjectDetails(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (projectId && (!currentProject || currentProject.id !== projectId || !isFresh || forceRefresh)) {
      fetchProjectDetails();
    }
  }, [projectId, currentProject, isFresh, forceRefresh, fetchProjectDetails]);

  return {
    project: currentProject,
    loading,
    error,
    isFresh,
    refetch: fetchProjectDetails
  };
};

// Hook for managing multiple data fetches
export const useDataManager = () => {
  const dispatch = useDispatch();

  const refreshAllData = useCallback(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserProjects());
    dispatch(fetchProjects());
  }, [dispatch]);

  const refreshUserData = useCallback(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserProjects());
  }, [dispatch]);

  const refreshProjectData = useCallback(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return {
    refreshAllData,
    refreshUserData,
    refreshProjectData
  };
}; 