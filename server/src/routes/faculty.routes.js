import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { allowRoles } from '../middlewares/role.middleware.js';
import { ensureApproved } from '../middlewares/approval.middleware.js';
import {
  createFacultyProblem,
  createFacultyTest,
  getLeaderboard,
  getMySubjects,
  getStudentPerformance,
  getSubmissions,
  listFacultyTests,
} from '../controllers/Faculty.controllers.js';

const router = Router();

router.use(verifyJWT, ensureApproved, allowRoles('FACULTY', 'ADMIN'));

router.get('/subjects', getMySubjects);
router.post('/problems', createFacultyProblem);
router.post('/tests', createFacultyTest);
router.get('/tests', listFacultyTests);
router.get('/submissions', getSubmissions);
router.get('/performance', getStudentPerformance);
router.get('/leaderboard', getLeaderboard);

export default router;
