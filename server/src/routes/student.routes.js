import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { allowRoles } from '../middlewares/role.middleware.js';
import { ensureApproved } from '../middlewares/approval.middleware.js';
import {
  getAssignedTests,
  getMyAttempts,
  getMySubmissions,
  getStudentLeaderboard,
  startAttempt,
  submitAttempt,
} from '../controllers/Student.controllers.js';

const router = Router();

router.use(verifyJWT, ensureApproved, allowRoles('STUDENT'));

router.get('/tests/assigned', getAssignedTests);
router.post('/tests/attempts/start', startAttempt);
router.post('/tests/attempts/submit', submitAttempt);
router.get('/tests/attempts', getMyAttempts);
router.get('/submissions', getMySubmissions);
router.get('/leaderboard', getStudentLeaderboard);

export default router;
