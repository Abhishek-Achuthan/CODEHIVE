import { Document, Schema } from 'mongoose';

export interface StripeWebhookEventDoc extends Document {
  eventId: string;
  processedAt: Date;
}

export interface StripeWebhookEventLeanDoc {
  eventId: string;
  processedAt: Date;
}

export const StripeWebhookEventSchema = new Schema<StripeWebhookEventDoc>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    processedAt: { type: Date, required: true },
  },
  { timestamps: false }
);
