import { inject, injectable } from 'tsyringe';
import type { WebhookEvent } from '../../domain/types/WebhookEvent';
import type { IStripeWebhookDispatcher } from '../../application/ports/payment/IStripeWebhookDispatcher';
import type { IStripeSubscriptionWebhookHandler } from '../../application/ports/payment/IStripeSubscriptionWebhookHandler';
import type { IStripeSessionWebhookHandler } from '../../application/ports/payment/IStripeSessionWebhookHandler';

@injectable()
export class StripeWebhookDispatcher implements IStripeWebhookDispatcher {
  private readonly _subscriptionEvents = [
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_failed',
  ];

  private readonly _sessionEvents = [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
  ];

  constructor(
    @inject('IStripeSubscriptionWebhookHandler')
    private readonly _subscriptionWebhookHandler: IStripeSubscriptionWebhookHandler,
    @inject('IStripeSessionWebhookHandler')
    private readonly _sessionWebhookHandler: IStripeSessionWebhookHandler,
  ) {}

  async dispatch(event: WebhookEvent): Promise<void> {
    if (this._subscriptionEvents.includes(event.type)) {
      await this._subscriptionWebhookHandler.handle(event);
      return;
    }

    if (this._sessionEvents.includes(event.type)) {
      await this._sessionWebhookHandler.handle(event);
      return;
    }
  }
}