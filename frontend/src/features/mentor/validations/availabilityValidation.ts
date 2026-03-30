import { z } from 'zod';

/**
 * Zod schema for Availability Form validation
 * Handles both one-time and recurring availability scenarios
 */
export const availabilityFormSchema = z.object({
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    slotDurationMinutes: z.coerce
        .number()
        .min(15, 'Minimum 15 minutes')
        .max(180, 'Maximum 180 minutes'),
    bufferMinutes: z.coerce
        .number()
        .min(0, 'Cannot be negative')
        .max(60, 'Maximum 60 minutes'),
    isRecurring: z.boolean(),
    date: z.string().optional(),
    slotPrice: z.coerce.number().min(0, 'Price must be positive'),

    // Recurring-specific fields
    selectedDays: z.array(z.string()).optional().default([]),
    durationType: z.enum(['forever', 'until', 'count']).optional().default('forever'),
    endDate: z.string().optional(),
    occurrenceCount: z.coerce.number().min(1).max(52).optional().default(12),
}).superRefine((data, ctx) => {
    // Validate end time > start time
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

    // Validate recurring days required when recurring
    if (data.isRecurring && (!data.selectedDays || data.selectedDays.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Select at least one day for recurring schedule',
            path: ['selectedDays'],
        });
    }

    // Validate end date required when "until" type selected
    if (data.isRecurring && data.durationType === 'until' && !data.endDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'End date is required',
            path: ['endDate'],
        });
    }
});

export type AvailabilityFormSchema = z.infer<typeof availabilityFormSchema>;
