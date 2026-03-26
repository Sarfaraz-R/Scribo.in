// client/src/api/auth.api.js
import axios from 'axios';
import api from './api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

/**
 * Silent token refresh called on app startup.
 *
 * ✅ Uses RAW axios (not the `api` instance) to avoid triggering the
 * response interceptor which itself calls this function — that would
 * cause an infinite loop.
 *
 * Returns the full ApiResponse shape: { data: { accessToken, user }, message, success }
 */
export const refreshAccessToken = async () => {
  const { data } = await axios.get(`${BASE_URL}/auth/refresh-token`, {
    withCredentials: true,
  });
  // console.log(data);
  return data; // { data: { accessToken, user }, message, success, statusCode }
};

// ── Institution registration ──────────────────────────────────────────────────
export const registerInstitution = async (payload) => {
  const { data } = await api.post('/auth/institute/register', payload);
  return data;
};

export const verifyInstitution = async (payload) => {
  const { data } = await api.post('/auth/institute/verify-otp', payload);
  return data;
};

// ── User registration ─────────────────────────────────────────────────────────
export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const verifyUser = async (payload) => {
  const { data } = await api.post('/auth/verify-otp', payload);
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const signIn = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const verifyEmailByToken = async (token) => {
  const { data } = await api.get(`/auth/verify-email/${token}`);
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

// ── Public ────────────────────────────────────────────────────────────────────
export const getAllInstitutions = async () => {
  const { data } = await api.get('/auth/institutions');
  // console.log(data);
  return data.data;
};
