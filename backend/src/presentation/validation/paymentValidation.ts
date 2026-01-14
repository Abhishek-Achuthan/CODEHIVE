import z from 'zod';

export const signatureSchema = z
  .string()
  .refine((val) => typeof val === 'string' && val !== '', {
    message: 'Missing stripe-signature header',
  });
