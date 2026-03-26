import { ApiError } from '../utils/ApiError.js';
import { addSubmissionToQueue } from '../queues.js/submission.queue.js';
import { submissionRepository } from '../repositories/submission.repository.js';
import { Problem } from '../models/Problem.models.js';
import { Student } from '../models/Student.models.js';

const buildTestCases = ({ type, customInput, problem }) => {
  if (type === 'run') {
    const sample = problem.testCases.filter((tc) => tc.isSample);
    if (customInput && customInput.trim() !== '') {
      return [
        ...sample,
        {
          _id: 'custom',
          input: customInput.trim(),
          output: null,
          isSample: false,
          isCustom: true,
        },
      ];
    }
    return sample;
  }

  return problem.testCases;
};

export const submissionService = {
  async queueSubmission({ payload, user }) {
    const { code, language, problemId, type = 'submit', customInput = '' } = payload;

    const problem = await Problem.findById(problemId).select('slug testCases limits');
    if (!problem) throw new ApiError(404, 'Problem not found');

    const testCasesToRun = buildTestCases({ type, customInput, problem });
    if (!testCasesToRun.length) {
      throw new ApiError(
        400,
        type === 'run'
          ? 'No sample test cases found. Please add custom input or contact the problem setter.'
          : 'No test cases found for this problem.'
      );
    }

    let submissionId = null;
    if (type === 'submit') {
      const studentProfile = await Student.findOne({ userId: user._id }).select(
        '_id'
      );

      const submission = await submissionRepository.createPending({
        userId: user._id,
        studentId: studentProfile?._id ?? null,
        problemId,
        code,
        language,
        status: 'Pending',
      });
      submissionId = submission._id;
    }

    await addSubmissionToQueue({
      submissionId,
      userId: user._id.toString(),
      code,
      language,
      problemSlug: problem.slug,
      type,
      testCases: testCasesToRun.map((tc) => ({
        id: tc._id?.toString(),
        input: tc.input,
        expectedOutput: tc.output ?? null,
        isSample: tc.isSample ?? false,
        isCustom: tc.isCustom ?? false,
      })),
      limits: {
        timeLimit: problem.limits?.timeLimit ?? 2000,
        memoryLimit: problem.limits?.memoryLimit ?? 256,
      },
    });

    return {
      success: true,
      submissionId,
      message: type === 'run' ? 'Running code...' : 'Submission queued',
    };
  },

  async processWorkerCallback({ submissionId, status, output, runtime, memory }) {
    if (submissionId) {
      await submissionRepository.updateResultById(submissionId, {
        status,
        output,
        runtime,
        memory,
      });
    }
  },

  async getProblemSubmissions({ problemId, userId }) {
    return submissionRepository.findByProblemAndUser({
      problemId,
      userId,
      limit: 50,
    });
  },

  async getSubmissionById({ submissionId, userId }) {
    const submission = await submissionRepository.findByIdForUser(
      submissionId,
      userId
    );

    if (!submission) {
      throw new ApiError(404, 'Submission not found');
    }

    return submission;
  },
};
