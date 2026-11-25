import { z } from 'zod';

export const analyzeSchema = z.object({
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters')
    .max(5000, 'Message must not exceed 5000 characters')
    .trim(),
  type: z
    .enum(['sms', 'email', 'whatsapp', 'job_offer', 'other'])
    .default('other'),
  language: z
    .enum(['en', 'hi', 'te'])
    .default('en'),
});

