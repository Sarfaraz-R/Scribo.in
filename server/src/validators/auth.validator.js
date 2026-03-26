import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'STUDENT', 'FACULTY']),
    institutionId: z.string().min(1).optional(),
    institutionCode: z.string().min(1).optional(),
    rollNumber: z.string().min(1).optional(),
    employeeId: z.string().min(1).optional(),
  }).superRefine((data, ctx) => {
    if (!data.institutionId && !data.institutionCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['institutionId'],
        message: 'institutionId or institutionCode is required',
      });
    }

    if (data.role === 'STUDENT' && !data.rollNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['rollNumber'],
        message: 'rollNumber is required for student registration',
      });
    }

    if (data.role === 'FACULTY' && !data.employeeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['employeeId'],
        message: 'employeeId is required for faculty registration',
      });
    }
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const signinSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
    role: z.string().optional(),
    institution: z.string().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().min(4).max(8),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
