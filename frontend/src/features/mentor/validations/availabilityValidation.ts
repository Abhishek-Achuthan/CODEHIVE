import { z } from 'zod';

export const availabilityFormSchema = z.object({
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    slotDurationMinutes: z.coerce
        .number()
        .min(1, 'Minimum 1 minute')
        .max(180, 'Maximum 180 minutes'),
    bufferMinutes: z.coerce
        .number()
        .min(0, 'Cannot be negative')
        .max(60, 'Maximum 60 minutes'),
    isRecurring: z.boolean(),
    date: z.string().optional(),
    slotPrice: z.coerce.number().min(0, 'Price must be positive'),

    selectedDays: z.array(z.string()).optional().default([]),
    durationType: z.enum(['forever', 'until', 'count']).optional().default('forever'),
    endDate: z.string().optional(),
    occurrenceCount: z.coerce.number().min(1).max(52).optional().default(12),
    sessionType: z.enum(['ONE_TO_ONE', 'PRIVATE_SESSION']).default('ONE_TO_ONE'),
    maxGuests: z.coerce.number().min(0).max(20).default(0),
}).superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
        const [startH, startM] = data.startTime.split(':').map(Number);
        const [endH, endM] = data.endTime.split(':').map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        if (endMinutes <= startMinutes) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'End time must be after start time',
                path: ['endTime'],
            });
        }
    }

    if (data.isRecurring && (!data.selectedDays || data.selectedDays.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Select at least one day for recurring schedule',
            path: ['selectedDays'],
        });
    }

    if (data.isRecurring && data.durationType === 'until' && !data.endDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'End date is required',
            path: ['endDate'],
        });
    }
});

export type AvailabilityFormSchema = z.infer<typeof availabilityFormSchema>;
