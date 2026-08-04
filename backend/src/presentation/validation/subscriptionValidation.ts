import z from 'zod';

export const createSubscriptionCheckoutSchema = z.object({
  planSlug: z.string().min(1, 'Plan slug is required'),
  billingInterval: z.enum(['monthly', 'yearly']).default('monthly'),
  successUrl: z.string().url('Success URL must be valid'),
  cancelUrl: z.string().url('Cancel URL must be valid'),
});
