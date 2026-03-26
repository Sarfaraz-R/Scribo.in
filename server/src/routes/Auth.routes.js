import { Router } from 'express';
import {
  getAllInstitutions,
  registerInstitution,
  verifyInstitutionRegistration,
} from '../controllers/Institution.controllers.js';
import {
  refreshAccessToken,
  register,
  signin,
  verifyUser,
  verifyEmailByToken,
  logoutUser,
} from '../controllers/Auth.controllers.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  registerSchema,
  signinSchema,
  verifyOtpSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.route('/institute/register').post(registerInstitution);
router.route('/institute/verify-otp').post(verifyInstitutionRegistration);
router.route('/institutions').get(getAllInstitutions);
router.route('/signin').post(validate(signinSchema), signin);
router.route('/login').post(validate(signinSchema), signin);
router.route('/register').post(validate(registerSchema), register);
router.route('/verify-otp').post(validate(verifyOtpSchema), verifyUser);
router.route('/verify-email/:token').get(verifyEmailByToken);

router.route('/refresh-token').get(refreshAccessToken);

router.route('/logout').post(logoutUser);

export default router;
