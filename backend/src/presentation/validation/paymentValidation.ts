import z from 'zod';
import { SessionStatus } from '../../domain/types/SessionStatus';
import { PaymentSource } from '../../domain/types/PaymentSource';

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
  role: z.enum(['mentor', 'mentee', 'all']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  'filter.status': z.nativeEnum(SessionStatus).optional(),
  'filter.dateFrom': z.string().regex(dateFormatRegex, 'dateFrom must be YYYY-MM-DD').optional(),
  'filter.dateTo': z.string().regex(dateFormatRegex, 'dateTo must be YYYY-MM-DD').optional(),
  'filter.paymentSource': z.nativeEnum(PaymentSource).optional(),
  'filter.refundableNow': z.coerce.boolean().optional(),
  search: z.string().optional(),
}).transform((raw) => ({
  role: raw.role,
  page: raw.page,
  limit: raw.limit,
  search: raw.search,
  filter: {
    ...(raw['filter.status'] !== undefined && { status: raw['filter.status'] }),
    ...(raw['filter.dateFrom'] !== undefined && { dateFrom: raw['filter.dateFrom'] }),
    ...(raw['filter.dateTo'] !== undefined && { dateTo: raw['filter.dateTo'] }),
    ...(raw['filter.paymentSource'] !== undefined && { paymentSource: raw['filter.paymentSource'] }),
    ...(raw['filter.refundableNow'] !== undefined && { refundableNow: raw['filter.refundableNow'] }),
  },
}));
