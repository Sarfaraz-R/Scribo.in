
import api from './api.js';
import { setUser, logout } from '../store/slice/auth.slice.js';

export const getCurrentUser = async (dispatch) => {
  try {
    const { data } = await api.get('/user/current-user');
    const { user } = data.data;
    dispatch(setUser({ user, token: null, role: user.role })); // token stays as-is
  } catch (error) {
    dispatch(logout()); // ✅ was importing non-existent `clearUser`
    throw error;
  }
};
