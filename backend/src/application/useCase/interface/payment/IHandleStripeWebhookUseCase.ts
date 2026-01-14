import { WebhookEvent } from '../../../../domain/types/WebhookEvent';

export interface IHandleStripeWebhookUseCase {
    execute(event: WebhookEvent): Promise<void>;
}
