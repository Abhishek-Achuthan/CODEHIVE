import { CreatePaymentIntentInput } from '../../../domain/types/CreatePaymentIntentInput';
import { CreatePaymentIntentResult } from '../../../domain/types/CreatePaymentIntentResult';
import { CreateRefundInput } from '../../../domain/types/CreateRefundInput';
import { WebhookEvent } from '../../../domain/types/WebhookEvent';
import { CreateSubscriptionCheckoutSessionInput } from '../../../domain/types/CreateSubscriptionCheckoutSessionInput';
import { CreateSubscriptionCheckoutSessionResult } from '../../../domain/types/CreateSubscriptionCheckoutSessionResult';

export interface IPaymentService {
  createPaymentIntent(
    input: CreatePaymentIntentInput
  ): Promise<CreatePaymentIntentResult>;
  getPaymentIntentClientSecret(paymentIntentId: string): Promise<string>;
  createRefund(input: CreateRefundInput): Promise<void>;
  cancelPaymentIntent(paymentIntentId: string): Promise<void>;
  verifyWebhookSignature(payload: Buffer, signature: string): WebhookEvent;
  createSubscriptionCheckoutSession(
    input: CreateSubscriptionCheckoutSessionInput
  ): Promise<CreateSubscriptionCheckoutSessionResult>;
}
