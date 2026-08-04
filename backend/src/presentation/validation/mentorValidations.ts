import { z } from 'zod';

// MongoDB ObjectId format validation
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Date format YYYY-MM-DD
const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

export const MentorListQuerySchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    'filter.primaryExpertise': z.string().optional(),
    'filter.experienceLevel': z.string().optional(),
    'filter.skillsAny': z.string().optional(),
    'filter.slotPriceMin': z.coerce.number().min(0).optional(),
    'filter.slotPriceMax': z.coerce.number().min(0).optional(),
    'filter.hasActiveAvailability': z.coerce.boolean().optional(),
}).transform((raw) => ({
    search: raw.search,
    page: raw.page,
    limit: raw.limit,
    filter: {
        ...(raw['filter.primaryExpertise'] !== undefined && { primaryExpertise: raw['filter.primaryExpertise'] }),
        ...(raw['filter.experienceLevel'] !== undefined && { experienceLevel: raw['filter.experienceLevel'] }),
        ...(raw['filter.skillsAny'] !== undefined && {
            skillsAny: raw['filter.skillsAny']
                .split(',')
                .map((skill) => skill.trim())
                .filter((skill) => skill.length > 0),
        }),
        ...(raw['filter.slotPriceMin'] !== undefined && { slotPriceMin: raw['filter.slotPriceMin'] }),
        ...(raw['filter.slotPriceMax'] !== undefined && { slotPriceMax: raw['filter.slotPriceMax'] }),
        ...(raw['filter.hasActiveAvailability'] !== undefined && { hasActiveAvailability: raw['filter.hasActiveAvailability'] }),
    },
}));

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
