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
