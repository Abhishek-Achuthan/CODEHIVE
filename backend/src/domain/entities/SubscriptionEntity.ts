import { SubscriptionStatus } from '../types/SubscriptionStatus';
import { PlanBillingInterval } from '../types/PlanBillingInterval';

export interface SubscriptionEntity {
  id: string;
  userId: string;
  planId: string;
  billingInterval: PlanBillingInterval;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  canceledAt?: Date;
  expiredAt?: Date;
  stripePriceId?: string;
  updatedAt: Date;
}