import type { WebhookEvent } from '../../../domain/types/WebhookEvent';

export interface IStripeWebhookDispatcher {
  dispatch(event: WebhookEvent): Promise<void>;
}
