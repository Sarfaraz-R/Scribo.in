import api from './api';

export const getAssignedTests = async () => {
  const res = await api.get('/student/tests/assigned');
  return res.data;
};

export const startStudentAttempt = async (testId) => {
  const res = await api.post('/student/tests/attempts/start', { testId });
  return res.data;
};

export const submitStudentAttempt = async (payload) => {
  const res = await api.post('/student/tests/attempts/submit', payload);
  return res.data;
};

export const getStudentAttempts = async () => {
  const res = await api.get('/student/tests/attempts');
  return res.data;
};

export const getStudentLeaderboard = async () => {
  const res = await api.get('/student/leaderboard');
  return res.data;
};

export const getStudentSubmissions = async () => {
  const res = await api.get('/student/submissions');
  return res.data;
};
