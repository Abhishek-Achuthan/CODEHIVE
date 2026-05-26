import { SubscriptionStatus } from '../../domain/types/SubscriptionStatus';
import { PlanBillingInterval } from '../../domain/types/PlanBillingInterval';

export interface CreateSubscriptionCheckoutSessionDTO {
  userId: string;
  planSlug: string;
  billingInterval: PlanBillingInterval;
  successUrl: string;
  cancelUrl: string;
}

export interface SubscriptionCheckoutSessionResponseDTO {
  url: string;
}

export interface SubscriptionResponseDTO {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  expiredAt?: Date;
  stripePriceId?: string;
  createdAt: Date;
  updatedAt: Date;
}