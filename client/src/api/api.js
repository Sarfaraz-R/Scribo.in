// client/src/api/api.js
import axios from 'axios';
import { store } from '../store/store';
import { setUser, logout } from '../store/slice/auth.slice';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends __s_rt cookie automatically
});

// ─── Request interceptor — attach current access token ────────────────────────
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — silent refresh on 401 ─────────────────────────────
let isRefreshing = false;
let failedQueue = []; // requests that arrived while refresh was in progress

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, once per request, and never for auth endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/')
    ) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Use raw axios to avoid going through this same interceptor (infinite loop)
        const { data } = await axios.get(`${BASE_URL}/auth/refresh-token`, {
          withCredentials: true,
        });

        const { accessToken, user } = data.data;

        store.dispatch(setUser({ user, token: accessToken, role: user.role }));

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
