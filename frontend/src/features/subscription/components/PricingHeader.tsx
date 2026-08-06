import { formatBillingIntervalLabel, formatSubscriptionDate } from "../hooks/useMySubscription";
import type { CurrentSubscription } from "../../../shared/types/api/subscription";

interface PricingHeaderProps {
  isAuthenticated: boolean;
  subscription: CurrentSubscription | null;
  subscriptionLoading: boolean;
}

export const PricingHeader = ({
  isAuthenticated,
  subscription,
  subscriptionLoading,
}: PricingHeaderProps) => (
  <header className="mb-3 text-center">
    <h1 className="text-2xl font-semibold tracking-tight text-white">Pricing</h1>
    <p className="mt-1 text-sm text-zinc-500">
      Simple plans that scale with your team.
    </p>
    {isAuthenticated && subscription && !subscriptionLoading && (
      <p className="mt-2 text-sm text-zinc-400">
        You are on{" "}
        <span className="font-medium text-white">
          {subscription.plan.name} ({formatBillingIntervalLabel(subscription.billingInterval)})
        </span>
        {subscription.cancelAtPeriodEnd ? (
          <> until {formatSubscriptionDate(subscription.currentPeriodEnd)}</>
        ) : (
          <> · renews {formatSubscriptionDate(subscription.currentPeriodEnd)}</>
        )}
      </p>
    )}
  </header>
);
