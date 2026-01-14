import { inject, injectable } from 'tsyringe';
import { type IPaymentService } from '../../../application/ports/payment/IPaymentService';
import { NextFunction, Request, Response } from 'express';
import { WebhookEvent } from '../../../domain/types/WebhookEvent';
import { type IHandleStripeWebhookUseCase } from '../../../application/useCase/interface/payment/IHandleStripeWebhookUseCase';

@injectable()
export class WebhookController {
    constructor(
        @inject('IPaymentService') private readonly _paymentService : IPaymentService,
        @inject('IHandleStripeWebhookUseCase') private readonly _handleStripeWebhook : IHandleStripeWebhookUseCase
    ){   }

    async handlePayment(req:Request,res:Response,next:NextFunction){
        try {
            const signature = req.headers['stripe-signature'];

            if (!signature || typeof signature !== 'string') {
                return res.status(400).json({ message: 'Missing stripe-signature header' });
            }

            const event = this._paymentService.verifyWebhookSignature(
                req.body,
                signature
            );

            await this._handleStripeWebhook.execute(event)
            return res.status(200).json({ received: true });
        } catch (error) {
            return res.status(400).json({ message: 'Webhook Error' });
        }

    }
}