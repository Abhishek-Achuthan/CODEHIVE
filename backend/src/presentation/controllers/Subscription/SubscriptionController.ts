import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../shared/httpStatusCode';
import type { ICreateSubscriptionCheckoutSessionUseCase } from '../../../application/useCase/interface/subscription/ICreateSubscriptionCheckoutSessionUseCase';
import type { IGetActiveSubscriptionUseCase } from '../../../application/useCase/interface/subscription/IGetActiveSubscriptionUseCase';
import { createSubscriptionCheckoutSchema } from '../../validation/subscriptionValidation';




@injectable()
export class SubscriptionController {
  constructor(
    @inject('ICreateSubscriptionCheckoutSessionUseCase') private readonly _createSubscriptionCheckoutSessionUseCase: ICreateSubscriptionCheckoutSessionUseCase,
    @inject('IGetActiveSubscriptionUseCase') private readonly _getActiveSubscriptionUseCase: IGetActiveSubscriptionUseCase
  ) { }

  async handleCheckoutSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const validated = createSubscriptionCheckoutSchema.parse(req.body);

      const data = await this._createSubscriptionCheckoutSessionUseCase.execute({
        userId,
        planSlug: validated.planSlug,
        billingInterval: validated.billingInterval,
        successUrl: validated.successUrl,
        cancelUrl: validated.cancelUrl,
      });

      res.status(HttpStatus.Created).json(data);
    } catch (error) {
      next(error)
    }
  }

  async handleGetActiveSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const data = await this._getActiveSubscriptionUseCase.execute(userId);

      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }
}
