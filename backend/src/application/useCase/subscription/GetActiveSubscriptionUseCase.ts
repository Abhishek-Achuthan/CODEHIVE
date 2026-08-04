import { inject, injectable } from 'tsyringe';
import { IGetActiveSubscriptionUseCase } from '../interface/subscription/IGetActiveSubscriptionUseCase';
import type { ISubscriptionRepository } from '../../../domain/interfaces/ISubscriptionRepository';
import type { IPlanRepository } from '../../../domain/interfaces/IPlanRepository';
import { CurrentSubscriptionResponseDTO } from '../../dto/subscriptionDTO';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { resolveSubscriptionBillingInterval } from '../../helpers/planBillingHelpers';

@injectable()
export class GetActiveSubscriptionUseCase implements IGetActiveSubscriptionUseCase {
  constructor(
    @inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,

    @inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
  ) {}

  async execute(userId: string): Promise<CurrentSubscriptionResponseDTO | null> {
    const subscription =
      await this._subscriptionRepository.findActiveByUserId(userId);

    if (!subscription || subscription.currentPeriodEnd <= new Date()) {
      return null;
    }

    const plan = await this._planRepository.find(subscription.planId);

    if (!plan) {
      throw new NotFoundError(ERROR_MESSAGES.PLAN.NOT_FOUND);
    }

    const billingInterval = resolveSubscriptionBillingInterval(
      plan,
      subscription.billingInterval,
      subscription.stripePriceId,
    );

    if (subscription.billingInterval !== billingInterval) {
      await this._subscriptionRepository.update(subscription.id, { billingInterval });
    }

    return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      billingInterval,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      plan: {
        id: plan.id,
        name: plan.name,
        slug: plan.slug,
      },
      ...(subscription.canceledAt ? { canceledAt: subscription.canceledAt } : {}),
      ...(subscription.expiredAt ? { expiredAt: subscription.expiredAt } : {}),
      ...(subscription.stripePriceId ? { stripePriceId: subscription.stripePriceId } : {}),
    };
  }
}
