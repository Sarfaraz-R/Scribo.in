import { verifyJWT } from '../middlewares/auth.middleware.js';
import { allowRoles } from '../middlewares/role.middleware.js';
import { ensureApproved } from '../middlewares/approval.middleware.js';
import { insertProblem } from '../controllers/Problem.controllers.js';
import {
  getProblemBySlug,
  getProblems,
} from '../controllers/Problem.controllers.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createProblemSchema,
  listProblemsSchema,
} from '../validators/problem.validator.js';

import Router from 'express';
const router = Router();

router.get('/', validate(listProblemsSchema), getProblems);
router.post(
  '/insert',
  verifyJWT,
  ensureApproved,
  allowRoles('ADMIN', 'FACULTY'),
  validate(createProblemSchema),
  insertProblem
);

router.get(
  '/:slug',
  verifyJWT,
  ensureApproved,
  allowRoles('STUDENT'),
  getProblemBySlug
);

export default router;

// verifyJWT, allowRoles('STUDENT'),
