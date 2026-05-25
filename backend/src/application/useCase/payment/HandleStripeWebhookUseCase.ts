import { inject, injectable } from 'tsyringe';
import type { WebhookEvent } from '../../../domain/types/WebhookEvent';
import type { IHandleStripeWebhookUseCase } from '../interface/payment/IHandleStripeWebhookUseCase';
import type { IStripeWebhookDispatcher } from '../../ports/payment/IStripeWebhookDispatcher';

@injectable()
export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
  constructor(
    @inject('IStripeWebhookDispatcher')
    private readonly _dispatcher: IStripeWebhookDispatcher,
  ) {}

  async execute(event: WebhookEvent): Promise<void> {
    await this._dispatcher.dispatch(event);
  }
}
