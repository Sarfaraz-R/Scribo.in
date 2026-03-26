import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error(
    {
      path: req.originalUrl,
      method: req.method,
      statusCode,
      error: err.stack || err,
    },
    'Request failed'
  );

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
  });
};
