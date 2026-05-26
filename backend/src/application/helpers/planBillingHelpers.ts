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
