import asyncHandler from '../utils/AsyncHandler.js';
import { problemService } from '../services/problem.service.js';

export const getProblemBySlug = asyncHandler(async (req, res) => {
  const response = await problemService.getProblemBySlug({
    slug: req.params.slug,
    user: req.user,
  });

  return res.status(200).json(response);
});

export const getProblems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const response = await problemService.listProblems({
    page: Number(page),
    limit: Number(limit),
    search,
  });
  console.log('Problems response:', response);

  return res.status(200).json(response);
});

export const insertProblem = asyncHandler(async (req, res) => {
  const response = await problemService.createProblem(req.body, req.user);
  return res.status(201).json(response);
});
