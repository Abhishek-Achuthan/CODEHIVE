export type PlanBillingInterval = "monthly" | "yearly";

export interface CreateSubscriptionCheckoutPayload {
  planSlug: string;
  billingInterval: PlanBillingInterval;
  successUrl: string;
  cancelUrl: string;
}

export interface SubscriptionCheckoutSessionResponse {
  url: string;
}

export type SubscriptionStatus =
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELED"
  | "EXPIRED"
  | "FREE";

export interface SubscriptionPlanSummary {
  id: string;
  name: string;
  slug: string;
}

export interface CurrentSubscription {
  id: string;
  userId: string;
  planId: string;
  billingInterval: PlanBillingInterval;
  plan: SubscriptionPlanSummary;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  expiredAt?: string;
  stripePriceId?: string;
  createdAt: string;
  updatedAt: string;
}
