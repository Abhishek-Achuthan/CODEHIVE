import { PlanEntity } from '../../domain/entities/PlanEntity';
import { PlanResponseDTO, ResolveUserEntitlementsResponseDTO } from '../dto/PlanDTO';
import { SubscriptionEntity } from '../../domain/entities/SubscriptionEntity';
import { SubscriptionStatus } from '../../domain/types/SubscriptionStatus';

export class PlanMapper {
  public static toResponse(plan: PlanEntity): PlanResponseDTO {
    return {
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      ...(plan.description !== undefined ? { description: plan.description } : {}),
      isActive: plan.isActive,
      isPublic: plan.isPublic,
      sortOrder: plan.sortOrder,
      features: plan.features,
      limits: plan.limits,
      pricing: {
        monthly: plan.pricing.monthly,
        yearly: plan.pricing.yearly,
        currency: plan.pricing.currency,
      },
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }

  public static toCreateResponse(plan: PlanEntity): PlanResponseDTO {
    return this.toResponse(plan);
  }

  public static toResponseList(plans: PlanEntity[]): PlanResponseDTO[] {
    return plans.map((plan) => this.toResponse(plan));
  }

  public static toEntitlementsResponse(
    resolvedPlan: PlanEntity,
    activeSubscription: SubscriptionEntity | null,
  ): ResolveUserEntitlementsResponseDTO {
    const features = [...new Set(resolvedPlan.features)];
    const limits = { ...resolvedPlan.limits };

    return {
      plan: {
        id: resolvedPlan.id,
        name: resolvedPlan.name,
        slug: resolvedPlan.slug,
      },
      features,
      limits,
      subscription: {
        isSubscribed: !!activeSubscription,
        status: activeSubscription
          ? activeSubscription.status
          : SubscriptionStatus.FREE,
      },
    };
  }
}
