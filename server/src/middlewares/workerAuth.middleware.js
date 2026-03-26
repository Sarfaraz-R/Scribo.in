import { env } from '../config/env.js';

/**
 * Validates the x-worker-secret header on internal callback routes.
 * Only the judge worker should know this secret.
 *
 * In production, set WORKER_SECRET to a long random string
 * and keep it out of version control.
 */
export const validateWorkerSecret = (req, res, next) => {
  const provided = req.headers['x-worker-secret'];

  if (!provided || provided !== env.WORKER_SECRET) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: invalid worker secret.',
    });
  }

  next();
};
