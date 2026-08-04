import type { WebhookEvent } from '../../../domain/types/WebhookEvent';

export interface IStripeSessionWebhookHandler {
  handle(event: WebhookEvent): Promise<void>;
}
