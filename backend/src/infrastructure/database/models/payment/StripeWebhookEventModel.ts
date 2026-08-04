import { model } from 'mongoose';
import {
  StripeWebhookEventDoc,
  StripeWebhookEventSchema,
} from '../../schemas/payment/StripeWebhookEventSchema';

export const StripeWebhookEventModel = model<StripeWebhookEventDoc>(
  'StripeWebhookEvent',
  StripeWebhookEventSchema
);
