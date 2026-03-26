import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { allowRoles } from '../middlewares/role.middleware.js';
import {
  approveFaculty,
  approveStudent,
  attachInstitutionAdmin,
  createBatch,
  createBranch,
  createFaculty,
  createProblem,
  createSection,
  createSubject,
  createTest,
  getPendingUsers,
  getAnalytics,
  importStudents,
  listBatches,
  listBranches,
  listFaculty,
  listProblems,
  listSections,
  listStudents,
  listSubjects,
  listTests,
  rejectUser,
} from '../controllers/Admin.controllers.js';
import { ensureApproved } from '../middlewares/approval.middleware.js';

const router = Router();

router.use(verifyJWT, ensureApproved, allowRoles('ADMIN'));

router.get('/pending-users', getPendingUsers);
router.post('/approve-student', approveStudent);
router.post('/approve-faculty', approveFaculty);
router.post('/reject-user', rejectUser);

router.post('/branches', createBranch);
router.get('/branches', listBranches);

router.post('/batches', createBatch);
router.get('/batches', listBatches);

router.post('/sections', createSection);
router.get('/sections', listSections);

router.post('/students/import', importStudents);
router.get('/students', listStudents);

router.post('/faculty', createFaculty);
router.get('/faculty', listFaculty);

router.post('/subjects', createSubject);
router.get('/subjects', listSubjects);

router.post('/problems', createProblem);
router.get('/problems', listProblems);

router.post('/tests', createTest);
router.get('/tests', listTests);

router.patch('/institution/admins', attachInstitutionAdmin);
router.get('/analytics', getAnalytics);

export default router;
