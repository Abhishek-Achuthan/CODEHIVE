import { PlanEntity } from '../../domain/entities/PlanEntity';
import { PlanBillingInterval } from '../../domain/types/PlanBillingInterval';

export function isPaidPlan(plan: PlanEntity): boolean {
  if (plan.slug === 'free') {
    return false;
  }

  return plan.pricing.monthly > 0 || plan.pricing.yearly > 0;
}

export function toStripeCurrency(currency: string): string {
  return currency.trim().toLowerCase();
}

export function toStripeUnitAmount(amount: number): number {
  return Math.round(amount * 100);
}

export interface PlanPricingSnapshot {
  monthly: number;
  yearly: number;
  currency: string;
}

export type PlanPricingUpdate = {
  monthly?: number | undefined;
  yearly?: number | undefined;
  currency?: string | undefined;
};

export function hasPlanPricingChanged(
  existing: PlanPricingSnapshot,
  update?: PlanPricingUpdate,
): boolean {
  if (!update) {
    return false;
  }

  const monthly = update.monthly !== undefined ? update.monthly : existing.monthly;
  const yearly = update.yearly !== undefined ? update.yearly : existing.yearly;
  const currency = (update.currency ?? existing.currency).trim().toUpperCase();

  return (
    monthly !== existing.monthly ||
    yearly !== existing.yearly ||
    currency !== existing.currency.trim().toUpperCase()
  );
}

export function resolvePlanStripePriceId(
  plan: PlanEntity,
  billingInterval: PlanBillingInterval,
): string | null {
  if (!plan.stripe) {
    return null;
  }

  if (billingInterval === 'yearly') {
    return plan.stripe.yearlyPriceId ?? null;
  }

  return plan.stripe.monthlyPriceId ?? null;
}
