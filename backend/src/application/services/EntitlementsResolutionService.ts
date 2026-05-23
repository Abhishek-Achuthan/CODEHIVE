import { inject, injectable } from "tsyringe";

import type { IPlanRepository } from "../../domain/interfaces/IPlanRepository";
import type { ISubscriptionRepository } from "../../domain/interfaces/ISubscriptionRepository";

import { NotFoundError } from "../../core/errors/NotFoundError";

import { ERROR_MESSAGES } from "../../shared/constants/errorMessages";

import { SubscriptionStatus } from "../../domain/types/SubscriptionStatus";

import { FeatureKey } from "../../domain/types/FeatureKey";
import { LimitKey } from "../../domain/types/LimitKey";

export interface ResolvedEntitlements {
  plan: {
    id: string;

    name: string;

    slug: string;
  };

  features: FeatureKey[];

  limits: Partial<Record<LimitKey, number>>;

  subscription: {
    isSubscribed: boolean;

    status: SubscriptionStatus;
  };
}

const VALID_SUBSCRIPTION_STATUSES = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
];

@injectable()
export class EntitlementResolutionService {
  constructor(
    @inject("IPlanRepository")
    private readonly _planRepository: IPlanRepository,

    @inject("ISubscriptionRepository")
    private readonly _subscriptionRepository: ISubscriptionRepository,
  ) {}

  async resolve(
    userId: string,
  ): Promise<ResolvedEntitlements> {
    const freePlan =
      await this._planRepository.findBySlug(
        "free",
      );

    if (!freePlan) {
      throw new NotFoundError(
        ERROR_MESSAGES.PLAN.FREE_PLAN_NOT_FOUND,
      );
    }

    const activeSubscription =
      await this._subscriptionRepository.findActiveByUserId(
        userId,
      );


    const hasValidSubscription =
      !!activeSubscription &&
      VALID_SUBSCRIPTION_STATUSES.includes(
        activeSubscription.status,
      ) &&
      activeSubscription.currentPeriodEnd >
        new Date();

    let resolvedPlan = freePlan;

    if (hasValidSubscription) {

      const subscribedPlan =
        await this._planRepository.find(
          activeSubscription.planId,
        );

      if (subscribedPlan) {
        resolvedPlan = subscribedPlan;
      }
    }

    const features = [
      ...new Set(resolvedPlan.features),
    ];

    const limits = {
      ...resolvedPlan.limits,
    };

    return {
      plan: {
        id: resolvedPlan.id,

        name: resolvedPlan.name,

        slug: resolvedPlan.slug,
      },

      features,

      limits,

      subscription: {
        isSubscribed: hasValidSubscription,

        status: hasValidSubscription
          ? activeSubscription.status
          : SubscriptionStatus.FREE,
      },
    };
  }
}