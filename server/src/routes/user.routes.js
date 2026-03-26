import { Router } from 'express';
import { getCurrentUser } from '../controllers/User.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/current-user').get(getCurrentUser);

export default router;
