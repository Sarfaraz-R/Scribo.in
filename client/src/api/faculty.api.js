import api from './api';

export const getFacultySubjects = async () => {
  const res = await api.get('/faculty/subjects');
  return res.data;
};

export const createFacultyProblem = async (payload) => {
  const res = await api.post('/faculty/problems', payload);
  return res.data;
};

export const createFacultyTest = async (payload) => {
  const res = await api.post('/faculty/tests', payload);
  return res.data;
};

export const getFacultyTests = async () => {
  const res = await api.get('/faculty/tests');
  return res.data;
};

export const getFacultySubmissions = async (params) => {
  const res = await api.get('/faculty/submissions', { params });
  return res.data;
};

export const getFacultyPerformance = async (params) => {
  const res = await api.get('/faculty/performance', { params });
  return res.data;
};

export const getFacultyLeaderboard = async (params) => {
  const res = await api.get('/faculty/leaderboard', { params });
  return res.data;
};
