import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/storeHooks";
import { fetchMySubscription } from "../../../store/slices/subscriptionSlice";

const DISMISS_KEY = "subscription_banner_dismissed";

export const SubscriptionBanner = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { subscription, fetched } = useAppSelector((state) => state.subscription);

  // Read dismissal state from sessionStorage (persists across route changes, resets on page refresh)
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem(DISMISS_KEY) === "true";
  });

  useEffect(() => {
    if (isAuthenticated && !fetched) {
      dispatch(fetchMySubscription());
    }
  }, [dispatch, fetched, isAuthenticated]);

  // If user is not logged in or has dismissed the bar in this session, don't show
  if (!isAuthenticated || isDismissed) {
    return null;
  }

  // Check if user has an active paid plan (slug !== "free" and price > 0 / ACTIVE status)
  const isPaidUser =
    subscription &&
    subscription.plan &&
    subscription.plan.slug !== "free" &&
    subscription.status === "ACTIVE";

  // If user has paid subscription, never show the banner
  if (isPaidUser) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setIsDismissed(true);
  };

  return (
    <div className="relative z-20 flex items-center justify-between border-b border-indigo-500/20 bg-gradient-to-r from-zinc-950 via-indigo-950/40 to-zinc-950 px-4 py-2 text-xs sm:text-sm text-zinc-300 shadow-md backdrop-blur-md">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-2.5 text-center">
        <span className="flex items-center gap-1.5 font-medium text-white">
          <span role="img" aria-label="crown" className="text-amber-400">
            👑
          </span>
          <span>You&apos;re on the <strong className="font-semibold text-amber-300">Free</strong> plan. Upgrade to unlock more features.</span>
        </span>

        <Link
          to="/pricing"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 shadow-[0_0_12px_rgba(79,70,229,0.35)]"
        >
          View Subscription
        </Link>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="ml-2 rounded-md p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
