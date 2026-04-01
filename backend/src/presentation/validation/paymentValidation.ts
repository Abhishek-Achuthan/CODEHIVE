import z from 'zod';

export const signatureSchema = z
  .string()
  .refine((val) => typeof val === 'string' && val !== '', {
    message: 'Missing stripe-signature header',
  });

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeFormatRegex = /^\d{2}:\d{2}$/;

export const bookSessionWithStripeSchema = z.object({
  mentorId: z.string().regex(objectIdRegex, 'Invalid mentor ID'),
  date: z.string().regex(dateFormatRegex, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(timeFormatRegex, 'startTime must be HH:mm'),
  endTime: z.string().regex(timeFormatRegex, 'endTime must be HH:mm'),
  topic: z.string().trim().min(1).max(100),
  clientRequestId: z.string().trim().min(1).max(100),
});

export const bookingReservationParamsSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid reservation ID'),
});

export const bookedSessionsQuerySchema = z.object({
  perspective: z.enum(['user', 'mentor']).default('user'),
});
