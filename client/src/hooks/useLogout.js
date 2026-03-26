// client/src/hooks/useLogout.js
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slice/auth.slice';
import { logoutUser } from '../api/auth.api';

/**
 * Returns a logout handler function.
 *
 * Usage:
 *   const handleLogout = useLogout();
 *   <button onClick={handleLogout}>Sign out</button>
 */
export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return async () => {
    try {
      await logoutUser(); // tells server to clear the __s_rt httpOnly cookie
    } catch {
      // Even if the server call fails, clear client-side state
    } finally {
      dispatch(logout());
      navigate('/auth/signin', { replace: true });
    }
  };
}
