import { login, logout } from '@/store/authSlice';
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const signIn = (username: string) => dispatch(login(username));
  const signOut = () => dispatch(logout());

  return { isAuthenticated, user, signIn, signOut };
};
