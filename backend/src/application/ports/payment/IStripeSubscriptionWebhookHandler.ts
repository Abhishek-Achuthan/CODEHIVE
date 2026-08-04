import type { WebhookEvent } from '../../../domain/types/WebhookEvent';

export interface IStripeSubscriptionWebhookHandler {
  handle(event: WebhookEvent): Promise<void>;
}