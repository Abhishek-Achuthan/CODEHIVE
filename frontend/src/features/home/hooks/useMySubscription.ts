import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { SubscriptionService } from "../../../services/subscriptionService";
import type { CurrentSubscription, PlanBillingInterval } from "../../../shared/types/api/subscription";
import type { PlanView } from "../../../shared/types/view/PlanView";

export function formatBillingIntervalLabel(interval: PlanBillingInterval): string {
  return interval === "yearly" ? "Yearly" : "Monthly";
}

export function isPlanCurrentForUser(
  plan: PlanView,
  subscription: CurrentSubscription | null,
  viewingBilling: PlanBillingInterval,
): boolean {
  if (subscription) {
    return (
      subscription.plan.id === plan.id && subscription.billingInterval === viewingBilling
    );
  }

  const isFreePlan =
    plan.slug === "free" || (plan.pricing.monthly === 0 && plan.pricing.yearly === 0);

  return isFreePlan && viewingBilling === "monthly";
}

export function isSamePlanBillingSwitch(
  plan: PlanView,
  subscription: CurrentSubscription | null,
  viewingBilling: PlanBillingInterval,
): boolean {
  if (!subscription) return false;

  const price = viewingBilling === "monthly" ? plan.pricing.monthly : plan.pricing.yearly;
  if (price === 0) return false;

  return (
    subscription.plan.id === plan.id && subscription.billingInterval !== viewingBilling
  );
}

export function getBillingSwitchLabel(viewingBilling: PlanBillingInterval): string {
  return viewingBilling === "yearly" ? "Switch to Yearly" : "Switch to Monthly";
}

export function useMySubscription(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!isAuthenticated || !enabled) {
      setSubscription(null);
      setLoading(false);
      return null;
    }

    setLoading(true);
    try {
      const data = await SubscriptionService.getMySubscription();
      setSubscription(data);
      return data;
    } catch {
      setSubscription(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enabled, isAuthenticated]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { subscription, loading, refetch, isAuthenticated };
}

export function formatSubscriptionDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
