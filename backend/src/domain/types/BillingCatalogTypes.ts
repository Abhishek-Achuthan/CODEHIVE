export type BillingInterval = 'month' | 'year';

export interface CreateBillingProductInput {
  name: string;
  description?: string;
  metadata: Record<string, string>;
}

export interface CreateBillingProductResult {
  productId: string;
}

export interface CreateBillingPriceInput {
  productId: string;
  unitAmountCents: number;
  currency: string;
  interval: BillingInterval;
  metadata?: Record<string, string>;
  idempotencyKey?: string;
}

export interface CreateBillingPriceResult {
  priceId: string;
}

export interface UpdateBillingProductInput {
  name?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface BillingCatalogSnapshot {
  productId: string;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
}
