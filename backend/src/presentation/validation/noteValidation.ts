import { z } from 'zod';

export const roomParamsSchema = z.object({
  roomId: z.string().trim().min(1, 'roomId is required'),
});

export const savePublicNoteSchema = z.object({
  content: z.string().trim().min(1, 'Content cannot be empty'),
});

export const savePrivateNoteSchema = z.object({
  content: z.record(z.string(), z.unknown()),
});
