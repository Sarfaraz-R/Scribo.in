import { z } from 'zod';

export const createProblemSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    description: z.string().min(10),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    inputFormat: z.string().min(1),
    outputFormat: z.string().min(1),
    tags: z.array(z.string()).optional(),
    company: z.array(z.string()).optional(),
    testCases: z
      .array(
        z.object({
          input: z.string(),
          output: z.string(),
          tier: z.number().int().min(1).max(3).optional(),
          isSample: z.boolean().optional(),
        })
      )
      .default([]),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    belongsTo: z.string().optional().nullable(),
    limits: z
      .object({
        timeLimit: z.number().int().positive().optional(),
        memoryLimit: z.number().int().positive().optional(),
      })
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const listProblemsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
  }),
});
