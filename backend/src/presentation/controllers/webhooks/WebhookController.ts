import { inject, injectable } from 'tsyringe';
import { type IPaymentService } from '../../../application/ports/payment/IPaymentService';
import { NextFunction, Request, Response } from 'express';
import { type IHandleStripeWebhookUseCase } from '../../../application/useCase/interface/payment/IHandleStripeWebhookUseCase';
import { signatureSchema } from '../../validation/paymentValidation';
import { HttpStatus } from '../../../shared/httpStatusCode';

@injectable()
export class WebhookController {
    constructor(
        @inject('IPaymentService') private readonly _paymentService : IPaymentService,
        @inject('IHandleStripeWebhookUseCase') private readonly _handleStripeWebhook : IHandleStripeWebhookUseCase
    ){   }

    async handlePayment(req:Request,res:Response,next:NextFunction){
        try {
            const signature = req.headers['stripe-signature'];

            const result = signatureSchema.safeParse(signature);
            if (!result.success) {
                return res.status(HttpStatus.Unauthorized).json({ message: result.error.message });
            }

            const event = this._paymentService.verifyWebhookSignature(
                req.body,
                result.data
            );

            await this._handleStripeWebhook.execute(event)
            return res.status(HttpStatus.OK).json({ received: true });
        } catch (error) {
            next(error);
        }

    }
}