import { Document, Schema } from 'mongoose';
import { StripeWebhookProcessingStatus } from '../../../../domain/types/StripeWebhookProcessingStatus';

export interface StripeWebhookEventDoc extends Document {
  eventId: string;
  type: string;
  status: StripeWebhookProcessingStatus;
  lastError: string | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StripeWebhookEventLeanDoc {
  eventId: string;
  type: string;
  status: StripeWebhookProcessingStatus;
  lastError: string | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const StripeWebhookEventSchema = new Schema<StripeWebhookEventDoc>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(StripeWebhookProcessingStatus),
      required: true,
    },
    lastError: { type: String, default: null },
    processedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
