import { IPaymentService } from '../../../application/ports/payment/IPaymentService';
import Stripe from 'stripe';
import { env } from '../../../config/envConfig';
import { CreatePaymentIntentInput } from '../../../domain/types/CreatePaymentIntentInput';
import { CreatePaymentIntentResult } from '../../../domain/types/CreatePaymentIntentResult';
import { CreateRefundInput } from '../../../domain/types/CreateRefundInput';
import { WebhookEvent } from '../../../domain/types/WebhookEvent';
import { BadRequestError } from '../../../core/errors/BadRequestError';


export class PaymentService implements IPaymentService {

    private _stripe: Stripe
    private _stripeSky: string;

    constructor(
    ) {
        this._stripeSky = env.stripeSKY!
        this._stripe = new Stripe(this._stripeSky);
    }

    async createPaymentIntent(input: CreatePaymentIntentInput): Promise<CreatePaymentIntentResult> {
        const intent = await this._stripe.paymentIntents.create({
            amount: input.amount * 100,
            currency: input.currency,
            metadata: input.metadata,
        }, {
            idempotencyKey: input.idempotencyKey,
        });

        if (!intent.client_secret) {
            throw new Error('Failed  to create payment intent');
        }

        return {
            clientSecret: intent.client_secret,
            paymentIntentId: intent.id
        }
    }

    async createRefund(input: CreateRefundInput): Promise<void> {
        await this._stripe.refunds.create({
            payment_intent: input.paymentIntentId,
        }, {
            idempotencyKey: input.idempotencyKey,
        });
    }

    async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
        await this._stripe.paymentIntents.cancel(paymentIntentId);
    }

    async getPaymentIntentClientSecret(paymentIntentId: string): Promise<string> {
        const intent = await this._stripe.paymentIntents.retrieve(paymentIntentId);

        if (!intent.client_secret) {
            throw new Error('Failed to retrieve payment intent client secret');
        }

        return intent.client_secret;
    }

    verifyWebhookSignature(payload: Buffer, signature: string): WebhookEvent {
        const secret = env.stripeWebhookSKY;
        try {
            const event = this._stripe.webhooks.constructEvent(payload, signature, secret);
            return {
                id: event.id,
                type: event.type,
                data: event.data,
            };
        } catch (error) {
            if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
                throw new BadRequestError('Invalid Stripe webhook signature');
            }

            throw error;
        }
    }
}
