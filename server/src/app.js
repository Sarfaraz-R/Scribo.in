// server/src/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import healthcheckRouter from './routes/healthcheck.routes.js';
import authRouter from './routes/Auth.routes.js';
import userRouter from './routes/user.routes.js'; // ✅ import userRouter
import problemRouter from './routes/Problem.routes.js';
import submissionRouter from '../src/modules/submission/submission.routes.js';
import adminRouter from './routes/admin.routes.js';
import facultyRouter from './routes/faculty.routes.js';
import studentRouter from './routes/student.routes.js';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware.js';
import { env } from './config/env.js';
const app = express();

/* ─────────────────────────────────────────────────────────────
   CORS
   ───────────────────────────────────────────────────────────── */
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'production' ? 300 : 2000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Preflight and bootstrap endpoints should not be rate-limited.
    if (req.method === 'OPTIONS') return true;

    const normalizedPath = req.path.toLowerCase();
    return (
      normalizedPath === '/auth/refresh-token' ||
      normalizedPath === '/auth/institutions'
    );
  },
  handler: (_req, res, _next, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: 'Too many requests, please try again in a few minutes.',
    });
  },
});

app.use(helmet());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

app.use('/api', limiter);

app.use(cookieParser());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

/* ─────────────────────────────────────────────────────────────
   ROUTES
   ───────────────────────────────────────────────────────────── */
app.use('/api/healthcheck', healthcheckRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter); // ✅
app.use('/api/problems', problemRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/admin', adminRouter);
app.use('/api/faculty', facultyRouter);
app.use('/api/student', studentRouter);

if (env.NODE_ENV !== 'production') {
  app.get('/api/docs', (_req, res) => {
    res.status(200).json({
      message: 'Swagger setup pending. See docs/backend-architecture-audit.md',
    });
  });
}

app.use(notFoundHandler);
/* ─────────────────────────────────────────────────────────────
   GLOBAL ERROR HANDLER
   ───────────────────────────────────────────────────────────── */
app.use(errorHandler);

export default app;
