import asyncHandler from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Student } from '../models/Student.models.js';
import { Test } from '../models/Test.models.js';
import { TestAttempt } from '../models/TestAttempt.models.js';
import Submission from '../modules/submission/submission.model.js';
import { redisConnection } from '../config/Redis.config.js';

const findStudentByUser = async (userId) => {
  return Student.findOne({ userId });
};

export const getAssignedTests = asyncHandler(async (req, res) => {
  const student = await findStudentByUser(req.user._id);
  if (!student) throw new ApiError(404, 'Student profile not found');

  const now = new Date();

  const tests = await Test.find({
    branchId: student.branchId,
    batchId: student.batchId,
    sectionIds: student.sectionId,
  })
    .populate('subjectId', 'name code')
    .sort({ startTime: 1 });

  const payload = tests.map((test) => ({
    ...test.toObject(),
    timingState:
      now < test.startTime ? 'UPCOMING' : now > test.endTime ? 'CLOSED' : 'LIVE',
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, payload, 'Assigned tests fetched successfully'));
});

export const startAttempt = asyncHandler(async (req, res) => {
  const student = await findStudentByUser(req.user._id);
  if (!student) throw new ApiError(404, 'Student profile not found');

  const test = await Test.findById(req.body.testId);
  if (!test) throw new ApiError(404, 'Test not found');

  const now = new Date();
  if (now < test.startTime) throw new ApiError(400, 'Test has not started yet');
  if (now > test.endTime) throw new ApiError(400, 'Test has already ended');

  const existing = await TestAttempt.findOne({
    studentId: student._id,
    testId: test._id,
  });

  if (existing) {
    return res
      .status(200)
      .json(new ApiResponse(200, existing, 'Attempt already exists'));
  }

  const attempt = await TestAttempt.create({
    studentId: student._id,
    testId: test._id,
    startedAt: now,
  });

  const timerKey = `test-timer:${attempt._id}`;
  await redisConnection.set(
    timerKey,
    JSON.stringify({ expiresAt: test.endTime.toISOString() }),
    'EX',
    Math.max(1, Math.floor((test.endTime.getTime() - now.getTime()) / 1000))
  );

  return res
    .status(201)
    .json(new ApiResponse(201, attempt, 'Test attempt started successfully'));
});

export const submitAttempt = asyncHandler(async (req, res) => {
  const { attemptId, score = 0, completedProblems = [] } = req.body;

  const attempt = await TestAttempt.findById(attemptId);
  if (!attempt) throw new ApiError(404, 'Attempt not found');
  if (attempt.state === 'SUBMITTED') {
    throw new ApiError(400, 'Attempt already submitted');
  }

  attempt.score = score;
  attempt.completedProblems = completedProblems;
  attempt.submittedAt = new Date();
  attempt.state = 'SUBMITTED';
  await attempt.save();

  return res
    .status(200)
    .json(new ApiResponse(200, attempt, 'Attempt submitted successfully'));
});

export const getMyAttempts = asyncHandler(async (req, res) => {
  const student = await findStudentByUser(req.user._id);
  if (!student) throw new ApiError(404, 'Student profile not found');

  const attempts = await TestAttempt.find({ studentId: student._id })
    .sort({ createdAt: -1 })
    .populate('testId', 'title subjectId startTime endTime');

  return res
    .status(200)
    .json(new ApiResponse(200, attempts, 'Attempts fetched successfully'));
});

export const getMySubmissions = asyncHandler(async (req, res) => {
  const student = await findStudentByUser(req.user._id);
  if (!student) throw new ApiError(404, 'Student profile not found');

  const submissions = await Submission.find({ studentId: student._id })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('problemId', 'title slug difficulty');

  return res
    .status(200)
    .json(new ApiResponse(200, submissions, 'Submissions fetched successfully'));
});

export const getStudentLeaderboard = asyncHandler(async (req, res) => {
  const cacheKey = 'leaderboard:student:global';
  const raw = await redisConnection.get(cacheKey);
  if (raw) {
    return res
      .status(200)
      .json(new ApiResponse(200, JSON.parse(raw), 'Leaderboard fetched (cached)'));
  }

  const leaderboard = await TestAttempt.aggregate([
    {
      $group: {
        _id: '$studentId',
        totalScore: { $sum: '$score' },
        attempts: { $sum: 1 },
      },
    },
    { $sort: { totalScore: -1 } },
    { $limit: 50 },
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
