import { useCallback, useState } from "react";
import { SubscriptionService } from "../../../services/subscriptionService";
import type { PlanBillingInterval } from "../../../shared/types/api/subscription";

interface StartCheckoutParams {
  planSlug: string;
  billingInterval: PlanBillingInterval;
}

export function useSubscriptionCheckout() {
  const [loading, setLoading] = useState(false);

  const startCheckout = useCallback(async ({ planSlug, billingInterval }: StartCheckoutParams) => {
    setLoading(true);
    try {
      const origin = window.location.origin;
      const { url } = await SubscriptionService.createCheckoutSession({
        planSlug,
        billingInterval,
        successUrl: `${origin}/pricing/success`,
        cancelUrl: `${origin}/pricing?checkout=cancelled`,
      });

      window.location.href = url;
      return { success: true as const };
    } catch {
      return { success: false as const };
    } finally {
      setLoading(false);
    }
  }, []);

  return { startCheckout, loading };
}
