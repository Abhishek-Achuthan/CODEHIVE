import { z } from 'zod';
import { Language } from '../../domain/types/Language';
import { env } from '../../config/envConfig';

export const executeCodeSchema = z.object({
  roomId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId'),
  sourceCode: z.string().max(env.maxSourceCodeSize, 'Source code exceeds maximum allowed size'),
  language: z.nativeEnum(Language),
  stdin: z.string().optional(),
});
