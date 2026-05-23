import { inject, injectable } from "tsyringe";
import { IResolveUserEntitlementsUseCase } from "../interface/entitlement/IResolveUserEntitlementsUseCase";
import { ResolveUserEntitlementsResponseDTO } from "../../dto/PlanDTO";
import type { IPlanRepository } from "../../../domain/interfaces/IPlanRepository";
import type { ISubscriptionRepository } from "../../../domain/interfaces/ISubscriptionRepository";
import { NotFoundError } from "../../../core/errors/NotFoundError";
import { ERROR_MESSAGES } from "../../../shared/constants/errorMessages";
import { SubscriptionStatus } from "../../../domain/types/SubscriptionStatus";
import { PlanMapper } from "../../mapper/PlanMapper";

const VALID_SUBSCRIPTION_STATUSES = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
];

@injectable()
export class ResolveUserEntitlementsUseCase implements IResolveUserEntitlementsUseCase {
  constructor(
    @inject("IPlanRepository")
    private readonly _planRepository: IPlanRepository,

    @inject("ISubscriptionRepository")
    private readonly _subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(userId: string): Promise<ResolveUserEntitlementsResponseDTO> {
    const freePlan = await this._planRepository.findBySlug("free");

    if (!freePlan)
      throw new NotFoundError(ERROR_MESSAGES.PLAN.FREE_PLAN_NOT_FOUND);

    const activeSubscription =
      await this._subscriptionRepository.findActiveByUserId(userId);

    const hasValidSubscription =
      !!activeSubscription &&
      VALID_SUBSCRIPTION_STATUSES.includes(activeSubscription.status) &&
      activeSubscription.currentPeriodEnd > new Date();

    let resolvedPlan = freePlan;

    if (hasValidSubscription) {
      const subscribedPlan = await this._planRepository.find(activeSubscription.planId,);

      if (subscribedPlan) {
        resolvedPlan = subscribedPlan;
      }
    }

    return PlanMapper.toEntitlementsResponse(
      resolvedPlan,
      hasValidSubscription ? activeSubscription : null,
    );
  }
}
