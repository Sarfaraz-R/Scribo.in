import express from 'express';
import {
  getProblemSubmissions,
  getSubmissionById,
  handleWorkerCallback,
  submitCode,
} from './submission.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { ensureApproved } from '../../middlewares/approval.middleware.js';
import { validateWorkerSecret } from '../../middlewares/workerAuth.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
  getProblemSubmissionsSchema,
  getSubmissionByIdSchema,
  submitCodeSchema,
} from '../../validators/submission.validator.js';

const router = express.Router();

router.get(
  '/problem/:problemId',
  verifyJWT,
  ensureApproved,
  validate(getProblemSubmissionsSchema),
  getProblemSubmissions
);
router.get(
  '/:submissionId',
  verifyJWT,
  ensureApproved,
  validate(getSubmissionByIdSchema),
  getSubmissionById
);
router.post(
  '/run',
  verifyJWT,
  ensureApproved,
  validate(submitCodeSchema),
  submitCode
);
router.post('/callback/results', validateWorkerSecret, handleWorkerCallback);

export default router;
