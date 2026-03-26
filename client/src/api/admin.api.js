import api from './api';

export const getAdminAnalytics = async () => {
  const res = await api.get('/admin/analytics');
  return res.data;
};

export const getBranches = async () => {
  const res = await api.get('/admin/branches');
  return res.data;
};

export const createBranch = async (payload) => {
  const res = await api.post('/admin/branches', payload);
  return res.data;
};

export const getBatches = async (branchId) => {
  const res = await api.get('/admin/batches', { params: branchId ? { branchId } : {} });
  return res.data;
};

export const createBatch = async (payload) => {
  const res = await api.post('/admin/batches', payload);
  return res.data;
};

export const getSections = async (batchId) => {
  const res = await api.get('/admin/sections', { params: batchId ? { batchId } : {} });
  return res.data;
};

export const createSection = async (payload) => {
  const res = await api.post('/admin/sections', payload);
  return res.data;
};

export const getStudents = async (params) => {
  const res = await api.get('/admin/students', { params });
  return res.data;
};

export const importStudents = async (students) => {
  const res = await api.post('/admin/students/import', { students });
  return res.data;
};

export const getFaculty = async () => {
  const res = await api.get('/admin/faculty');
  return res.data;
};

export const createFaculty = async (payload) => {
  const res = await api.post('/admin/faculty', payload);
  return res.data;
};

export const getSubjects = async (params) => {
  const res = await api.get('/admin/subjects', { params });
  return res.data;
};

export const createSubject = async (payload) => {
  const res = await api.post('/admin/subjects', payload);
  return res.data;
};

export const getProblems = async () => {
  const res = await api.get('/admin/problems');
  return res.data;
};

export const createProblem = async (payload) => {
  const res = await api.post('/admin/problems', payload);
  return res.data;
};

export const getTests = async () => {
  const res = await api.get('/admin/tests');
  return res.data;
};

export const createTest = async (payload) => {
  const res = await api.post('/admin/tests', payload);
  return res.data;
};

export const getPendingUsers = async () => {
  const res = await api.get('/admin/pending-users');
  return res.data;
};

export const approveStudent = async (payload) => {
  const res = await api.post('/admin/approve-student', payload);
  return res.data;
};

export const approveFaculty = async (payload) => {
  const res = await api.post('/admin/approve-faculty', payload);
  return res.data;
};

export const rejectUser = async (payload) => {
  const res = await api.post('/admin/reject-user', payload);
  return res.data;
};
