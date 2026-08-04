export type CreatePaymentIntentInput = {
  amount: number;
  currency: 'inr';
  metadata: Record<string, string>;
  idempotencyKey: string;
};
