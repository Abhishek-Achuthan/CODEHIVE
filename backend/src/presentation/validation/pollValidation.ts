import z from "zod";

export const pollOptionSchema = z.object({
    text: z.string().min(1, 'Option text cannot be empty'),
});

export const createPollSchema = z.object({
    question: z.string().min(1, 'Question text cannot be empty'),
    options: z.array(pollOptionSchema).min(2, 'At least two options are required'),
    allowMultiple: z.boolean().optional(),
    expiresAt: z.string().datetime().optional(),
});

export const submitPollVoteSchema = z.object({
    optionIds: z.array(z.string().min(1)).min(1, 'At least one option is required'),
});
