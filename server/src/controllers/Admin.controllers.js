import mongoose from 'mongoose';
import asyncHandler from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { InstitutionModel } from '../models/Institution.models.js';
import { Branch } from '../models/Branch.models.js';
import { Batch } from '../models/Batch.models.js';
import { Section } from '../models/Section.models.js';
import { Student } from '../models/Student.models.js';
import { Faculty } from '../models/Faculty.models.js';
import { Subject } from '../models/Subject.models.js';
import { Problem } from '../models/Problem.models.js';
import { Test } from '../models/Test.models.js';
import { TestAttempt } from '../models/TestAttempt.models.js';
import Submission from '../modules/submission/submission.model.js';
import User from '../models/User.models.js';

const resolveInstitutionId = (req) => {
  const fromUser = req.user?.institutionId?.toString();
  const fromBody = req.body?.institutionId;
  return fromUser || fromBody;
};

export const createBranch = asyncHandler(async (req, res) => {
  const institutionId = resolveInstitutionId(req);
  if (!institutionId) throw new ApiError(400, 'institutionId is required');

  const branch = await Branch.create({
    name: req.body.name,
    institutionId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, branch, 'Branch created successfully'));
});

export const listBranches = asyncHandler(async (req, res) => {
  const institutionId = req.user?.institutionId;
  const branches = await Branch.find({ institutionId }).sort({ name: 1 });
  return res
    .status(200)
    .json(new ApiResponse(200, branches, 'Branches fetched successfully'));
});

export const createBatch = asyncHandler(async (req, res) => {
  const { branchId, startYear, endYear } = req.body;
  if (startYear >= endYear) {
    throw new ApiError(400, 'endYear must be greater than startYear');
  }

  const batch = await Batch.create({ branchId, startYear, endYear });
  return res
    .status(201)
    .json(new ApiResponse(201, batch, 'Batch created successfully'));
});

export const listBatches = asyncHandler(async (req, res) => {
  const { branchId } = req.query;
  const query = branchId ? { branchId } : {};
  const batches = await Batch.find(query).sort({ startYear: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, batches, 'Batches fetched successfully'));
});

export const createSection = asyncHandler(async (req, res) => {
  const { name, batchId, facultyIds = [] } = req.body;
  const section = await Section.create({ name, batchId, facultyIds });
  return res
    .status(201)
    .json(new ApiResponse(201, section, 'Section created successfully'));
});

export const listSections = asyncHandler(async (req, res) => {
  const { batchId } = req.query;
  const query = batchId ? { batchId } : {};
  const sections = await Section.find(query).sort({ name: 1 });
  return res
    .status(200)
    .json(new ApiResponse(200, sections, 'Sections fetched successfully'));
});

export const importStudents = asyncHandler(async (req, res) => {
  const institutionId = resolveInstitutionId(req);
  const rows = Array.isArray(req.body.students) ? req.body.students : [];
  if (!rows.length) throw new ApiError(400, 'students array is required');

  const docs = rows.map((row) => ({
    name: row.name,
    email: row.email,
    rollNumber: row.rollNumber,
    institutionId,
    branchId: row.branchId,
    batchId: row.batchId,
    sectionId: row.sectionId,
    subjects: row.subjects || [],
  }));

  const inserted = await Student.insertMany(docs, { ordered: false });

  return res
    .status(201)
    .json(new ApiResponse(201, inserted, 'Students imported successfully'));
});

export const listStudents = asyncHandler(async (req, res) => {
  const institutionId = req.user?.institutionId;
  const { branchId, batchId, sectionId } = req.query;
  const query = { institutionId };
  if (branchId) query.branchId = branchId;
  if (batchId) query.batchId = batchId;
  if (sectionId) query.sectionId = sectionId;

  const students = await Student.find(query)
    .sort({ createdAt: -1 })
    .limit(500)
    .select('-testHistory');

  return res
    .status(200)
    .json(new ApiResponse(200, students, 'Students fetched successfully'));
});

export const createFaculty = asyncHandler(async (req, res) => {
  const institutionId = resolveInstitutionId(req);
  const faculty = await Faculty.create({
    name: req.body.name,
    email: req.body.email,
    institutionId,
    subjects: req.body.subjects || [],
    branches: req.body.branches || [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, faculty, 'Faculty created successfully'));
});

export const listFaculty = asyncHandler(async (req, res) => {
  const institutionId = req.user?.institutionId;
  const faculty = await Faculty.find({ institutionId }).sort({ name: 1 });
  return res
    .status(200)
    .json(new ApiResponse(200, faculty, 'Faculty fetched successfully'));
});

export const createSubject = asyncHandler(async (req, res) => {
  const institutionId = resolveInstitutionId(req);
  const subject = await Subject.create({
    name: req.body.name,
    code: req.body.code,
    branchId: req.body.branchId,
    batchId: req.body.batchId,
    facultyId: req.body.facultyId || null,
    institutionId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subject, 'Subject created successfully'));
});

export const listSubjects = asyncHandler(async (req, res) => {
  const institutionId = req.user?.institutionId;
  const { branchId, batchId } = req.query;
  const query = { institutionId };
  if (branchId) query.branchId = branchId;
  if (batchId) query.batchId = batchId;

  const subjects = await Subject.find(query)
    .populate('facultyId', 'name email')
    .sort({ name: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, subjects, 'Subjects fetched successfully'));
});

export const createProblem = asyncHandler(async (req, res) => {
  const institutionId = resolveInstitutionId(req);
  const payload = {
    ...req.body,
    institutionId,
    createdBy: req.user._id,
    slug: req.body.slug.toLowerCase(),
  };

  const exists = await Problem.findOne({ slug: payload.slug });
  if (exists) throw new ApiError(409, 'Problem slug already exists');

  const problem = await Problem.create(payload);
  return res
    .status(201)
    .json(new ApiResponse(201, problem, 'Problem created successfully'));
});

export const listProblems = asyncHandler(async (req, res) => {
  const institutionId = req.user?.institutionId;
  const problems = await Problem.find({ institutionId })
    .sort({ createdAt: -1 })
    .select('title slug difficulty tags createdAt');

  return res
    .status(200)
    .json(new ApiResponse(200, problems, 'Problems fetched successfully'));
});

export const createTest = asyncHandler(async (req, res) => {
  const institutionId = resolveInstitutionId(req);
  const test = await Test.create({
    ...req.body,
    institutionId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, test, 'Test created successfully'));
});

export const listTests = asyncHandler(async (req, res) => {
  const institutionId = req.user?.institutionId;
  const tests = await Test.find({ institutionId })
    .sort({ startTime: -1 })
    .populate('subjectId', 'name code')
    .populate('sectionIds', 'name');

  return res
    .status(200)
    .json(new ApiResponse(200, tests, 'Tests fetched successfully'));
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const institutionId = req.user?.institutionId;
  const institutionObjectId = new mongoose.Types.ObjectId(institutionId);

  const [
    branches,
    batches,
    sections,
    students,
    faculty,
    subjects,
    problems,
    tests,
    attempts,
    submissions,
    acceptedSubmissions,
  ] = await Promise.all([
    Branch.countDocuments({ institutionId }),
    Batch.countDocuments({}),
    Section.countDocuments({}),
    Student.countDocuments({ institutionId }),
    Faculty.countDocuments({ institutionId }),
    Subject.countDocuments({ institutionId }),
    Problem.countDocuments({ institutionId }),
    Test.countDocuments({ institutionId }),
    TestAttempt.countDocuments({}),
    Submission.countDocuments({}),
    Submission.countDocuments({ status: 'Accepted' }),
  ]);

  const problemSuccessRate = submissions
    ? Number(((acceptedSubmissions / submissions) * 100).toFixed(2))
    : 0;

  const performanceByDifficulty = await Submission.aggregate([
    {
      $lookup: {
        from: 'problems',
        localField: 'problemId',
        foreignField: '_id',
        as: 'problem',
      },
    },
    { $unwind: '$problem' },
    { $match: { 'problem.institutionId': institutionObjectId } },
    {
      $group: {
        _id: '$problem.difficulty',
        total: { $sum: 1 },
        accepted: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        difficulty: '$_id',
        total: 1,
        accepted: 1,
        successRate: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ['$accepted', '$total'] }, 100] }, 2] },
          ],
        },
      },
    },
  ]);

  const payload = {
    overview: {
      branches,
      batches,
      sections,
      students,
      faculty,
      subjects,
      problems,
      tests,
      attempts,
      submissions,
      problemSuccessRate,
    },
    performanceByDifficulty,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, payload, 'Analytics fetched successfully'));
});

export const attachInstitutionAdmin = asyncHandler(async (req, res) => {
  const institution = await InstitutionModel.findById(req.user?.institutionId);
  if (!institution) throw new ApiError(404, 'Institution not found');

  const adminId = req.body.adminUserId;
  institution.adminUsers = Array.from(
    new Set([...(institution.adminUsers || []).map(String), String(adminId)])
  );

  await institution.save();

  return res
    .status(200)
    .json(new ApiResponse(200, institution, 'Admin user attached successfully'));
});

export const getPendingUsers = asyncHandler(async (req, res) => {
  const institutionId = req.user?.institutionId;

  const users = await User.find({
    institutionId,
    role: { $in: ['STUDENT', 'FACULTY'] },
    status: 'pending',
    emailVerified: true,
  })
    .sort({ createdAt: -1 })
    .select(
      'name email role rollNumber employeeId status emailVerified createdAt institutionId branchId batchId sectionId subjects'
    );

  return res
    .status(200)
    .json(new ApiResponse(200, users, 'Pending users fetched successfully'));
});

export const approveStudent = asyncHandler(async (req, res) => {
  const { userId, branchId, batchId, sectionId } = req.body;
  if (!userId || !branchId || !batchId || !sectionId) {
    throw new ApiError(400, 'userId, branchId, batchId and sectionId are required');
  }

  const user = await User.findOne({
    _id: userId,
    institutionId: req.user?.institutionId,
    role: 'STUDENT',
  });
  if (!user) throw new ApiError(404, 'Pending student not found');

  if (!user.emailVerified) {
    throw new ApiError(400, 'Student email is not verified yet');
  }

  const [branch, batch, section] = await Promise.all([
    Branch.findOne({ _id: branchId, institutionId: req.user?.institutionId }),
    Batch.findById(batchId),
    Section.findById(sectionId),
  ]);

  if (!branch) throw new ApiError(404, 'Branch not found for institution');
  if (!batch) throw new ApiError(404, 'Batch not found');
  if (!section) throw new ApiError(404, 'Section not found');
  if (String(batch.branchId) !== String(branchId)) {
    throw new ApiError(400, 'Batch does not belong to selected branch');
  }
  if (String(section.batchId) !== String(batchId)) {
    throw new ApiError(400, 'Section does not belong to selected batch');
  }

  user.status = 'approved';
  user.branchId = branchId;
  user.batchId = batchId;
  user.sectionId = sectionId;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Student approved successfully'));
});

export const approveFaculty = asyncHandler(async (req, res) => {
  const { userId, branchId, subjects = [] } = req.body;
  if (!userId || !branchId) {
    throw new ApiError(400, 'userId and branchId are required');
  }

  const user = await User.findOne({
    _id: userId,
    institutionId: req.user?.institutionId,
    role: 'FACULTY',
  });
  if (!user) throw new ApiError(404, 'Pending faculty not found');

  if (!user.emailVerified) {
    throw new ApiError(400, 'Faculty email is not verified yet');
  }

  const branch = await Branch.findOne({
    _id: branchId,
    institutionId: req.user?.institutionId,
  });
  if (!branch) throw new ApiError(404, 'Branch not found for institution');

  const subjectIds = Array.isArray(subjects)
    ? subjects.filter(Boolean)
    : [];

  if (subjectIds.length) {
    const subjectCount = await Subject.countDocuments({
      _id: { $in: subjectIds },
      institutionId: req.user?.institutionId,
    });
    if (subjectCount !== subjectIds.length) {
      throw new ApiError(400, 'One or more selected subjects are invalid');
    }
  }

  user.status = 'approved';
  user.branchId = branchId;
  user.subjects = subjectIds;
  user.batchId = null;
  user.sectionId = null;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Faculty approved successfully'));
});

export const rejectUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new ApiError(400, 'userId is required');

  const user = await User.findOne({
    _id: userId,
    institutionId: req.user?.institutionId,
    role: { $in: ['STUDENT', 'FACULTY'] },
  });
  if (!user) throw new ApiError(404, 'User not found');

  user.status = 'rejected';
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Registration request rejected'));
});
