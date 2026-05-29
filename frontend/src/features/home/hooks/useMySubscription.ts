import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { SubscriptionService } from "../../../services/subscriptionService";
import type { CurrentSubscription } from "../../../shared/types/api/subscription";
import type { PlanView } from "../../../shared/types/view/PlanView";

export function isPlanCurrentForUser(
  plan: PlanView,
  subscription: CurrentSubscription | null,
): boolean {
  if (subscription) {
    return subscription.plan.id === plan.id;
  }

  const isFreePlan =
    plan.slug === "free" || (plan.pricing.monthly === 0 && plan.pricing.yearly === 0);

  return isFreePlan;
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
