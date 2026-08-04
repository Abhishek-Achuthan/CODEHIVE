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

export function resolvePlanBillingIntervalFromPriceId(
  plan: PlanEntity,
  stripePriceId: string | undefined,
): PlanBillingInterval | null {
  if (!stripePriceId || !plan.stripe) {
    return null;
  }

  if (plan.stripe.yearlyPriceId === stripePriceId) {
    return 'yearly';
  }

  if (plan.stripe.monthlyPriceId === stripePriceId) {
    return 'monthly';
  }

  return null;
}

export function resolveBillingIntervalFromStripeRecurring(
  interval: string | undefined,
): PlanBillingInterval | null {
  if (interval === 'year') {
    return 'yearly';
  }

  if (interval === 'month') {
    return 'monthly';
  }

  return null;
}

export function resolveSubscriptionBillingInterval(
  plan: PlanEntity,
  storedInterval: PlanBillingInterval | undefined,
  stripePriceId: string | undefined,
  stripeRecurringInterval?: string,
): PlanBillingInterval {
  const fromPrice = resolvePlanBillingIntervalFromPriceId(plan, stripePriceId);
  if (fromPrice) {
    return fromPrice;
  }

  const fromRecurring = resolveBillingIntervalFromStripeRecurring(stripeRecurringInterval);
  if (fromRecurring) {
    return fromRecurring;
  }

  if (storedInterval === 'monthly' || storedInterval === 'yearly') {
    return storedInterval;
  }

  return 'monthly';
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
