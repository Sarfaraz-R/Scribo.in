import { sendResultToClient } from '../../socket/socket.manager.js';
import { submissionService } from '../../services/submission.service.js';
import asyncHandler from '../../utils/AsyncHandler.js';

export const submitCode = asyncHandler(async (req, res) => {
  const payload = await submissionService.queueSubmission({
    payload: req.body,
    user: req.user,
  });

  return res.status(202).json(payload);
});

// {
//         userId,
//         submissionId, // null for "run" — controller handles that
//         status: overallStatus,
//         output: JSON.stringify(output),
//         runtime,
//         memory,
//  }
export const handleWorkerCallback = asyncHandler(async (req, res) => {
  const { userId, submissionId, status, output, runtime, memory } = req.body;

  await submissionService.processWorkerCallback({
    submissionId,
    status,
    output,
    runtime,
    memory,
  });

  sendResultToClient('CODE_RESULT', userId, {
    submissionId,
    status,
    output,
    runtime,
    memory,
  });

  return res.status(200).json({ received: true });
});

export const getProblemSubmissions = asyncHandler(async (req, res) => {
  const { problemId } = req.validated?.params ?? req.params;
  const submissions = await submissionService.getProblemSubmissions({
    problemId,
    userId: req.user._id,
  });

  return res.status(200).json({ success: true, data: submissions });
});

export const getSubmissionById = asyncHandler(async (req, res) => {
  const { submissionId } = req.validated?.params ?? req.params;
  const submission = await submissionService.getSubmissionById({
    submissionId,
    userId: req.user._id,
  });

  return res.status(200).json({ success: true, data: submission });
});
