import { inject, injectable } from 'tsyringe';
import { ICreateSubscriptionCheckoutSessionUseCase } from '../interface/subscription/ICreateSubscriptionCheckoutSessionUseCase';
import {
  CreateSubscriptionCheckoutSessionDTO,
  SubscriptionCheckoutSessionResponseDTO,
} from '../../dto/subscriptionDTO';
import type { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import type { ISubscriptionRepository } from '../../../domain/interfaces/ISubscriptionRepository';
import type { IPaymentService } from '../../ports/payment/IPaymentService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ConflictError } from '../../../core/errors/ConflictError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { SubscriptionStatus } from '../../../domain/types/SubscriptionStatus';
import { SubscriptionMapper } from '../../mapper/SubscriptionMapper';
import { resolvePlanStripePriceId } from '../../helpers/planBillingHelpers';

@injectable()
export class CreateSubscriptionCheckoutSessionUseCase implements ICreateSubscriptionCheckoutSessionUseCase {
  constructor(
    @inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,

    @inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,

    @inject('IPaymentService')
    private readonly _paymentService: IPaymentService,
  ) {}

  async execute(
    data: CreateSubscriptionCheckoutSessionDTO,
  ): Promise<SubscriptionCheckoutSessionResponseDTO> {

    const plan = await this._planRepository.findBySlug(data.planSlug);

    if (!plan) {
      throw new NotFoundError(ERROR_MESSAGES.PLAN.NOT_FOUND);
    }

    if (!plan.isActive) {
      throw new BadRequestError(ERROR_MESSAGES.PLAN.INACTIVE);
    }

    if (plan.slug.toLowerCase() === 'free') {
      throw new BadRequestError(
        ERROR_MESSAGES.PLAN.FREE_PLAN_CANNOT_BE_PURCHASED,
      );
    }

    const stripePriceId = resolvePlanStripePriceId(plan, data.billingInterval);

    if (!stripePriceId) {
      throw new BadRequestError(
        data.billingInterval === 'yearly'
          ? ERROR_MESSAGES.PLAN.STRIPE_YEARLY_PRICE_NOT_CONFIGURED
          : ERROR_MESSAGES.PLAN.STRIPE_PRICE_NOT_CONFIGURED,
      );
    }

    const existingSubscription =
      await this._subscriptionRepository.findActiveByUserId(data.userId);

    const hasValidSubscription =
      !!existingSubscription &&
      [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING].includes(
        existingSubscription.status,
      ) &&
      existingSubscription.currentPeriodEnd > new Date();

    if (hasValidSubscription) {
      throw new ConflictError(ERROR_MESSAGES.SUBSCRIPTION.ALREADY_ACTIVE);
    }

    const checkoutSession =
      await this._paymentService.createSubscriptionCheckoutSession({
        userId: data.userId,

        stripePriceId,

        successUrl: data.successUrl,

        cancelUrl: data.cancelUrl,

        metadata: {
          userId: data.userId,

          planId: plan.id,

          planSlug: plan.slug,

          billingInterval: data.billingInterval,
        },
      });

    return SubscriptionMapper.toCheckoutSessionResponse(checkoutSession.url);
  }
}
