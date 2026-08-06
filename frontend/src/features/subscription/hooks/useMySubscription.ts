import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/storeHooks";
import { fetchMySubscription, clearSubscription } from "../../../store/slices/subscriptionSlice";
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

  // Allow switching from monthly to yearly ONLY.
  return (
    subscription.plan.id === plan.id &&
    subscription.billingInterval === "monthly" &&
    viewingBilling === "yearly"
  );
}

export function isYearlyToMonthlyDowngrade(
  plan: PlanView,
  subscription: CurrentSubscription | null,
  viewingBilling: PlanBillingInterval,
): boolean {
  if (!subscription) return false;
  return (
    subscription.plan.id === plan.id &&
    subscription.billingInterval === "yearly" &&
    viewingBilling === "monthly"
  );
}

export function getBillingSwitchLabel(viewingBilling: PlanBillingInterval): string {
  return viewingBilling === "yearly" ? "Switch to Yearly" : "Switch to Monthly";
}

export function useMySubscription(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { subscription, loading, fetched } = useAppSelector((state) => state.subscription);

  const refetch = useCallback(async () => {
    if (!isAuthenticated || !enabled) {
      dispatch(clearSubscription());
      return null;
    }
    const action = await dispatch(fetchMySubscription());
    if (fetchMySubscription.fulfilled.match(action)) {
      return action.payload;
    }
    return null;
  }, [dispatch, enabled, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && enabled && !fetched) {
      void refetch();
    }
  }, [enabled, fetched, isAuthenticated, refetch]);

  return { subscription, loading, refetch, isAuthenticated };
}

export function formatSubscriptionDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
