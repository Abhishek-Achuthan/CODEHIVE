import { IPaymentService } from '../../../application/ports/payment/IPaymentService';
import Stripe from 'stripe';
import { env } from '../../../config/envConfig';
import { CreatePaymentIntentInput } from '../../../domain/types/CreatePaymentIntentInput';
import { CreatePaymentIntentResult } from '../../../domain/types/CreatePaymentIntentResult';
import { WebhookEvent } from '../../../domain/types/WebhookEvent';


export class PaymentService implements IPaymentService {

    private _stripe : Stripe
    private _stripeSky : string;

    constructor(
    ){
        this._stripeSky = env.stripeSKY!
        this._stripe = new Stripe(this._stripeSky);
    }

    async processPayment(input:CreatePaymentIntentInput): Promise<CreatePaymentIntentResult> {
        const intent = await this._stripe.paymentIntents.create({
            amount:input.amount *100,
            currency:input.currency,
            metadata:input.metadata,
        });

        if(!intent.client_secret) {
            throw new Error('Failed  to create payment intent');
        }

        return {
            clientSecret: intent.client_secret,
            paymentIntentId:intent.id
        }
    }

    verifyWebhookSignature(payload : Buffer,signature:string): WebhookEvent {
        const event = this._stripe.webhooks.constructEvent(payload,signature,env.stripeWebhookSKY!);
        return {
            id: event.id,
            type: event.type,
            data: event.data,
        };
    }
}