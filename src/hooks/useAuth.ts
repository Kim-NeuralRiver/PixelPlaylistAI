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
    const hasToken = tokenManager.isAuthenticated();

    if (hasToken && !isAuthenticated) {
      dispatch(login('user'));
    } else if (!hasToken && isAuthenticated) {
      dispatch(logout());
    }
  }, [dispatch, isAuthenticated]); // Sync auth state with token manager, 
  // Runs on mount to check if user is auth based on token presence or lack thereof

  const signIn = async (username: string, password: string) => {
    try { 
      const response = await fetch(`${BASE_URL}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData.detail || 'Login failed, invalid credentials.');
      }

      const data = await response.json();

      tokenManager.setTokens(data.access, data.refresh); // Store tokens in token manager
      dispatch(login(username));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
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
    isAuthenticated: tokenManager.isAuthenticated(),
    user, 
    signIn, 
    signOut,
    signUp 
  };
};
