import { z } from 'zod';

// MongoDB ObjectId format validation
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Date format YYYY-MM-DD
const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

export const MentorListQuerySchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
});

export const MentorIdParamSchema = z.object({
    mentorId: z.string().refine(
        val => objectIdRegex.test(val),
        { message: 'Invalid mentor ID format' }
    ),
});

export const AvailabilityIdParamSchema = z.object({
    id: z.string().refine(
        val => objectIdRegex.test(val),
        { message: 'Availability ID is required and must be valid' }
    ),
});

export const GetAvailableSlotsQuerySchema = z.object({
    date: z.string()
        .regex(dateFormatRegex, 'date query param is required (YYYY-MM-DD)'),
});

export const AddExceptionBodySchema = z.object({
    date: z.string()
        .regex(dateFormatRegex, 'Date must be in YYYY-MM-DD format'),
});
