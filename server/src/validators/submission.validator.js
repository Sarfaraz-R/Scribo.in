import { z } from 'zod';

const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId');

export const submitCodeSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    language: z.enum(['cpp', 'python', 'java', 'javascript']),
    problemId: z.string().min(1),
    type: z.enum(['run', 'submit']).optional(),
    customInput: z.string().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const getProblemSubmissionsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    problemId: mongoIdSchema,
  }),
});

export const getSubmissionByIdSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    submissionId: mongoIdSchema,
  }),
});
