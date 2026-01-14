import { injectable } from 'tsyringe';
import { WebhookEvent } from '../../../domain/types/WebhookEvent';
import { IHandleStripeWebhookUseCase } from '../interface/payment/IHandleStripeWebhookUseCase';

@injectable()
export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
    async execute(event: WebhookEvent): Promise<void> {
        switch (event.type) {
            case 'payment_intent.succeeded':
                return;
            case 'payment_intent.payment_failed':
                return;
            default:
                return;
        }
    }
}
