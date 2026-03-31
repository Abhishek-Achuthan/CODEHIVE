import { CreatePaymentIntentInput } from '../../../domain/types/CreatePaymentIntentInput';
import { CreatePaymentIntentResult } from '../../../domain/types/CreatePaymentIntentResult';
import { CreateRefundInput } from '../../../domain/types/CreateRefundInput';
import { WebhookEvent } from '../../../domain/types/WebhookEvent';

export interface IPaymentService {
  createPaymentIntent(
    input: CreatePaymentIntentInput
  ): Promise<CreatePaymentIntentResult>;
  getPaymentIntentClientSecret(paymentIntentId: string): Promise<string>;
  createRefund(input: CreateRefundInput): Promise<void>;
  cancelPaymentIntent(paymentIntentId: string): Promise<void>;
  verifyWebhookSignature(payload: Buffer, signature: string): WebhookEvent;
}
