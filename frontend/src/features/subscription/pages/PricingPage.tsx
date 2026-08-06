import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import type { PlanView } from "../../../shared/types/view/PlanView";
import type { PlanBillingInterval } from "../../../shared/types/api/subscription";
import { useFetchPublicPlans } from "../hooks/useFetchPublicPlans";
import { useSubscriptionCheckout } from "../hooks/useSubscriptionCheckout";
import {
  formatBillingIntervalLabel,
  isPlanCurrentForUser,
  isSamePlanBillingSwitch,
  isYearlyToMonthlyDowngrade,
  useMySubscription,
} from "../hooks/useMySubscription";
import { getPricingGridClass } from "../utils/pricingUtils";
import { PricingHeader } from "../components/PricingHeader";
import { BillingToggle } from "../components/BillingToggle";
import { PlanCard } from "../components/PlanCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { triggerCelebrationConfetti } from "../../../shared/utils/confetti";

const PricingPage = () => {
  const [billing, setBilling] = useState<PlanBillingInterval>("monthly");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { plans, loading, error } = useFetchPublicPlans();
  const { subscription, loading: subscriptionLoading } = useMySubscription();
  const { startCheckout, loading: checkoutLoading } = useSubscriptionCheckout();

  const checkoutCancelled = searchParams.get("checkout") === "cancelled";

  useEffect(() => {
    if (searchParams.get("checkout") === "success" || searchParams.get("success") === "true") {
      triggerCelebrationConfetti();
      toast.success("Subscription updated successfully!");
    }
  }, [searchParams]);

  const handleCheckout = async (plan: PlanView, billingInterval: PlanBillingInterval) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }

    if (
      subscription &&
      subscription.plan.id === plan.id &&
      subscription.billingInterval === billingInterval
    ) {
      toast.error(
        `You are already on ${plan.name} (${formatBillingIntervalLabel(billingInterval)}).`
      );
      return;
    }

    if (
      subscription &&
      subscription.plan.id === plan.id &&
      subscription.billingInterval === "yearly" &&
      billingInterval === "monthly"
    ) {
      toast.error("Downgrading from yearly to monthly billing is not supported.");
      return;
    }

    const result = await startCheckout({ planSlug: plan.slug, billingInterval });
    if (result && !result.success) {
      toast.error("Could not start checkout. Please try again.");
    }
  };

  const popularIndex = Math.floor(plans.length / 2);
  const skeletonCount = Math.max(plans.length, 3);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <PricingHeader
          isAuthenticated={isAuthenticated}
          subscription={subscription}
          subscriptionLoading={subscriptionLoading}
        />

        {checkoutCancelled && (
          <div className="mb-4 flex justify-center">
            <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
              <span>Checkout was cancelled. You can try again anytime.</span>
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="shrink-0 text-zinc-500 hover:text-white"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <BillingToggle billing={billing} onChange={setBilling} />

        {loading ? (
          <div className={getPricingGridClass(skeletonCount)}>
            {[...Array(skeletonCount)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="py-16 text-center text-sm text-zinc-500">{error}</p>
        ) : plans.length === 0 ? (
          <p className="py-16 text-center text-sm text-zinc-600">No plans available right now.</p>
        ) : (
          <div className={getPricingGridClass(plans.length)}>
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                previousPlan={i > 0 ? plans[i - 1]! : null}
                billing={billing}
                isPopular={i === popularIndex && plans.length > 1}
                isCurrentPlan={isPlanCurrentForUser(plan, subscription, billing)}
                isBillingSwitch={isSamePlanBillingSwitch(plan, subscription, billing)}
                isYearlyToMonthlyDowngrade={isYearlyToMonthlyDowngrade(plan, subscription, billing)}
                index={i}
                checkoutLoading={checkoutLoading}
                onCheckout={handleCheckout}
              />
            ))}
          </div>
        )}

        {!loading && !error && plans.length > 0 && (
          <p className="mt-8 text-center text-xs text-zinc-600">
            All paid plans include a 14-day free trial.
          </p>
        )}
      </div>
    </main>
  );
};

export default PricingPage;
