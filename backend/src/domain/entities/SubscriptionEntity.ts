import { SubscriptionStatus } from "../types/SubscriptionStatus";

export interface SubscriptionEntity {
  id: string;

  userId: string;

  planId: string;

  status: SubscriptionStatus;

  currentPeriodStart: Date;

  currentPeriodEnd: Date;

  cancelAtPeriodEnd: boolean;

  stripeCustomerId?: string;

  stripeSubscriptionId?: string;

  createdAt: Date;

  updatedAt: Date;
}