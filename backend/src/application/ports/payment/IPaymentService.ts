import { CreatePaymentIntentInput } from '../../../domain/types/CreatePaymentIntentInput';
import { CreatePaymentIntentResult } from '../../../domain/types/CreatePaymentIntentResult';
import { WebhookEvent } from '../../../domain/types/WebhookEvent';

export interface IPaymentService {
    processPayment(input:CreatePaymentIntentInput) :Promise<CreatePaymentIntentResult>
    verifyWebhookSignature(payload:Buffer,signature:string):WebhookEvent
}