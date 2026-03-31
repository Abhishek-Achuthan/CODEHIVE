import { ClientSession } from 'mongoose';

export type StripeWebhookBeginResult = 'new' | 'processed' | 'processing';

export interface IStripeWebhookEventRepository {
  beginProcessing(
    eventId: string,
    type: string,
    session: ClientSession
  ): Promise<StripeWebhookBeginResult>;
  markProcessed(eventId: string, session: ClientSession): Promise<void>;
  markFailed(eventId: string, errorMessage: string): Promise<void>;
}
