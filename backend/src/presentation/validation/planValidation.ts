import z from 'zod';
import { FeatureKey } from '../../domain/types/FeatureKey';
import { LimitKey } from '../../domain/types/LimitKey';
import { isStripeBillingCurrency } from '../../shared/constants/stripeBillingCurrencies';

export const createPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-_]+$/, 'Slug must only contain lowercase letters, numbers, hyphens, and underscores'),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  features: z.array(z.nativeEnum(FeatureKey)).default([]),
  limits: z.record(z.nativeEnum(LimitKey), z.number().nonnegative()).optional(),
  pricing: z.object({
    monthly: z.number().nonnegative('Monthly price must be non-negative'),
    yearly: z.number().nonnegative('Yearly price must be non-negative'),
    currency: z
      .string()
      .length(3)
      .refine((value) => isStripeBillingCurrency(value), {
        message: 'Unsupported currency. Use a Stripe-supported code like USD or INR',
      }),
  }),
});

export const planIdParamSchema = z.object({
  id: z.string().min(1, 'Plan ID is required'),
});

export const planSlugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export const listPlansQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const updatePlanSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  slug: z
    .string()
    .min(1, 'Slug cannot be empty')
    .regex(/^[a-z0-9-_]+$/, 'Slug must only contain lowercase letters, numbers, hyphens, and underscores')
    .optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  features: z.array(z.nativeEnum(FeatureKey)).optional(),
  limits: z.record(z.nativeEnum(LimitKey), z.number().nonnegative()).optional(),
  pricing: z.object({
    monthly: z.number().nonnegative('Monthly price must be non-negative').optional(),
    yearly: z.number().nonnegative('Yearly price must be non-negative').optional(),
    currency: z
      .string()
      .length(3)
      .refine((value) => isStripeBillingCurrency(value), {
        message: 'Unsupported currency. Use a Stripe-supported code like USD or INR',
      })
      .optional(),
  }).optional(),
});
