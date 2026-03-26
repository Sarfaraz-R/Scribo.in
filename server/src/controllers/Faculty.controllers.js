import asyncHandler from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Problem } from '../models/Problem.models.js';
import { Test } from '../models/Test.models.js';
import { Subject } from '../models/Subject.models.js';
import { Student } from '../models/Student.models.js';
import { TestAttempt } from '../models/TestAttempt.models.js';
import Submission from '../modules/submission/submission.model.js';
import { redisConnection } from '../config/Redis.config.js';

const getCachedJson = async (key) => {
  const raw = await redisConnection.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    await redisConnection.del(key);
    return null;
  }
};

export const getMySubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ facultyId: req.user._id })
    .populate('branchId', 'name')
    .populate('batchId', 'startYear endYear')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, subjects, 'Faculty subjects fetched successfully'));
});

export const createFacultyProblem = asyncHandler(async (req, res) => {
  const institutionId = req.user.institutionId;
  const slug = req.body.slug.toLowerCase();

  const exists = await Problem.findOne({ slug });
  if (exists) throw new ApiError(409, 'Problem slug already exists');

  const problem = await Problem.create({
    ...req.body,
    slug,
    institutionId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, problem, 'Problem created successfully'));
});

export const createFacultyTest = asyncHandler(async (req, res) => {
  const test = await Test.create({
    ...req.body,
    institutionId: req.user.institutionId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, test, 'Test created successfully'));
});

export const listFacultyTests = asyncHandler(async (req, res) => {
  const tests = await Test.find({ createdBy: req.user._id })
    .populate('subjectId', 'name code')
    .sort({ startTime: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tests, 'Faculty tests fetched successfully'));
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const { testId, problemId } = req.query;
  const query = {};
  if (testId) query.testId = testId;
  if (problemId) query.problemId = problemId;

  const submissions = await Submission.find(query)
    .sort({ createdAt: -1 })
    .limit(500)
    .populate('problemId', 'title slug')
    .populate('studentId', 'name email rollNumber');

  return res
    .status(200)
    .json(new ApiResponse(200, submissions, 'Submissions fetched successfully'));
});

export const getStudentPerformance = asyncHandler(async (req, res) => {
  const { sectionId } = req.query;

  const students = await Student.find(
    sectionId ? { sectionId } : { institutionId: req.user.institutionId }
  )
    .select('name email rollNumber streak')
    .limit(500);

  const studentIds = students.map((s) => s._id);
  const [attemptsAgg, submissionsAgg] = await Promise.all([
    TestAttempt.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      {
        $group: {
          _id: '$studentId',
          attempts: { $sum: 1 },
          avgScore: { $avg: '$score' },
        },
      },
    ]),
    Submission.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      {
        $group: {
          _id: '$studentId',
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
    ]),
  ]);

  const attemptsMap = new Map(attemptsAgg.map((a) => [String(a._id), a]));
  const submissionsMap = new Map(submissionsAgg.map((a) => [String(a._id), a]));

  const performance = students.map((student) => {
    const attempts = attemptsMap.get(String(student._id));
    const subs = submissionsMap.get(String(student._id));
    const totalSubs = subs?.total || 0;
    const acceptedSubs = subs?.accepted || 0;
    return {
      student,
      attempts: attempts?.attempts || 0,
      avgTestScore: attempts ? Number((attempts.avgScore || 0).toFixed(2)) : 0,
      successRate: totalSubs
        ? Number(((acceptedSubs / totalSubs) * 100).toFixed(2))
        : 0,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, performance, 'Student performance fetched'));
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const { testId = 'global' } = req.query;
  const cacheKey = `leaderboard:faculty:${testId}`;

  const cached = await getCachedJson(cacheKey);
  if (cached) {
    return res
      .status(200)
      .json(new ApiResponse(200, cached, 'Leaderboard fetched (cached)'));
  }

  const query = testId === 'global' ? {} : { testId };
  const leaderboard = await TestAttempt.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$studentId',
        totalScore: { $sum: '$score' },
        attempts: { $sum: 1 },
        lastSubmittedAt: { $max: '$submittedAt' },
      },
    },
    { $sort: { totalScore: -1, lastSubmittedAt: 1 } },
    { $limit: 100 },
    {
      $lookup: {
        from: 'students',
        localField: '_id',
        foreignField: '_id',
        as: 'student',
      },
    },
    { $unwind: '$student' },
    {
      $project: {
        _id: 0,
        studentId: '$student._id',
        name: '$student.name',
        rollNumber: '$student.rollNumber',
        totalScore: 1,
        attempts: 1,
      },
    },
  ]);

  await redisConnection.set(cacheKey, JSON.stringify(leaderboard), 'EX', 120);

  return res
    .status(200)
    .json(new ApiResponse(200, leaderboard, 'Leaderboard fetched successfully'));
});
