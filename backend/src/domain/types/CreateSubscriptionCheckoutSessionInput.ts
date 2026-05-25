export type CreateSubscriptionCheckoutSessionInput = {
  userId: string;
  stripePriceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
};
