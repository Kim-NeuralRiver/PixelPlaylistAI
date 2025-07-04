import { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/store/authSlice';
import { RootState } from '@/store/store';
import { api } from '@/lib/apiClient';
import { tokenManager } from '@/utils/api/tokenManager'; // Import token manager utility

export const useAuth = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Sync Redux state with actual token on load
  useEffect(() => {
  // Check for valid token on app startup
    const initializeAuth = async () => {
      try {
        const token = await tokenManager.ensureValidToken();
        if (token && !isAuthenticated) {
          // Could fetch user profile here if needed
          dispatch(login('user')); // Or get actual username from token
        }
      } catch (error) {
        console.log('Token initialization failed:', error);
        tokenManager.clearTokens();
        dispatch(logout());
      }
    };

    initializeAuth();
  }, [isAuthenticated, dispatch]); // Run on mount and when isAuthenticated or dispatch changes
  // Runs on mount to check if user is auth based on token presence or lack thereof

  const signIn = async (email: string, password: string) => {
    try {
      // Input validation
    if (!email.trim() || !password.trim()) {
      return { success: false, error: 'Please enter both email and password' };
    }

    try {
      const data = await api.post<{access: string, refresh: string}>(
        'api/token/', 
        { email: email.trim(), username: email.trim(), password },
        { requiresAuth: false }
      );
      
      if (!data.access || !data.refresh) {
        return { success: false, error: 'Invalid response from server' };
      }
      
      tokenManager.setTokens(data.access, data.refresh);
      dispatch(login(email));
      
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error.message || 'Network error. Please check your connection.' 
      };
    }
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { 
      success: false, 
      error: 'Network error. Please check your connection.' 
      };
    }
  };

  // Sign up
  const signUp = async (
  username: string,
  email: string,
  password: string,
  name?: string ) => {
    try {
      await api.post('api/users/', { username, email, password, name }, { requiresAuth: false });
      return { success: true, message: 'Account created successfully! You may now sign in. :)' };
    } catch (error: any) {
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  // Sign out user by clearing tokens and updating Redux state
  const signOut = () => {
    tokenManager.clearTokens();
    dispatch(logout());
  };

  // Return auth state and actions
  return { 
    isAuthenticated: tokenManager.isAuthenticated() && isAuthenticated,
    user, 
    signIn, 
    signOut,
    signUp 
  };
};
