import { z } from 'zod';
import { CapabilityKey } from '../../domain/types/CapabilityKey';

export const participantOverridesParamsSchema = z.object({
  roomId: z.string().trim().min(1, 'roomId is required'),
  userId: z.string().trim().min(1, 'userId is required'),
});

const validCapabilityKeySet = new Set(Object.values(CapabilityKey));


export const updateParticipantOverridesBodySchema = z.object({
  overrides: z
    .record(z.string(), z.boolean())
    .superRefine((val, ctx) => {
      const keys = Object.keys(val);

      if (keys.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'overrides must contain at least one capability key',
        });
        return;
      }

      for (const key of keys) {
        if (!validCapabilityKeySet.has(key as CapabilityKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid capability key: "${key}"`,
            path: [key],
          });
        }
      }
    }),
});
