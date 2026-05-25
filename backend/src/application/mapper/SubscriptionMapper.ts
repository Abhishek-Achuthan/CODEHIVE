import { SubscriptionEntity } from '../../domain/entities/SubscriptionEntity';
import {
  SubscriptionResponseDTO,
  SubscriptionCheckoutSessionResponseDTO,
} from '../dto/subscriptionDTO';

export class SubscriptionMapper {
  public static toResponse(subscription: SubscriptionEntity): SubscriptionResponseDTO {
    return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      ...(subscription.canceledAt ? { canceledAt: subscription.canceledAt } : {}),
      ...(subscription.expiredAt ? { expiredAt: subscription.expiredAt } : {}),
      ...(subscription.stripePriceId ? { stripePriceId: subscription.stripePriceId } : {}),
    };
  }

  public static toResponseList(subscriptions: SubscriptionEntity[]): SubscriptionResponseDTO[] {
    return subscriptions.map((sub) => this.toResponse(sub));
  }

  public static toCheckoutSessionResponse(url: string): SubscriptionCheckoutSessionResponseDTO {
    return {
      url,
    };
  }
}
