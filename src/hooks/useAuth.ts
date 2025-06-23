import { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/store/authSlice';
import { RootState } from '@/store/store';
import { tokenManager } from '@/utils/api/tokenManager';

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

      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${BASE_URL}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          username: email.trim(), 
          password 
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Invalid email or password' };
        }
        if (response.status >= 500) {
          return { success: false, error: 'Server error. Please try again later.' };
        }
        
        const errorData = await response.json().catch(() => null);
        return { 
          success: false, 
          error: errorData?.detail || errorData?.message || 'Sign in failed' 
        };
      }

      const data = await response.json();
      
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
        error: 'Network error. Please check your connection.' 
      };
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
    name?: string ) => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, name }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || data.message || 'Sign up failed :(');
        }

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
