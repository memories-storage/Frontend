import { useAuth } from '../context/AuthContext';
import { authUtils } from '../utils/auth';

/**
 * Custom hook to get the current user ID with multiple fallbacks
 * @returns {string|null} The current user ID or null if not available
 */
export const useUserId = () => {
  const { user } = useAuth();
  
  // Try to get userId from user object first, then from cookies
  return authUtils.getUserId(user);
};

export default useUserId; 