import { SubscriptionStatus } from '../../domain/types/SubscriptionStatus';

export interface CreateSubscriptionCheckoutSessionDTO {
  userId: string;
  planSlug: string;
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