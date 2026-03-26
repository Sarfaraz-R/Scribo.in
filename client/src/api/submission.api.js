import { asyncHandler } from '../utils/asyncHandler';
import api from './api';

export const getProblemSubmissions = asyncHandler(async (problemId) => {
  const { data } = await api.get(`/submissions/problem/${problemId}`);
  return data;
});

export const getSubmissionById = asyncHandler(async (submissionId) => {
  const { data } = await api.get(`/submissions/${submissionId}`);
  return data;
});
