import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import { useFetchPublicPlans } from "../hooks/useFetchPublicPlans";
import { useSubscriptionCheckout } from "../hooks/useSubscriptionCheckout";
import type { PlanView, FeatureKey, LimitKey } from "../../../shared/types/view/PlanView";
import type { PlanBillingInterval } from "../../../shared/types/api/subscription";

// ─── Labels & priority ────────────────────────────────────────────────────────

const FEATURE_LABELS: Record<FeatureKey, string> = {
  chat: "Real-time Chat",
  notes: "Shared Notes",
  polls: "Live Polls",
  whiteboard: "Collaborative Whiteboard",
  screen_share: "Screen Sharing",
  code_editor: "Code Editor",
  video_audio: "Video & Audio",
  private_rooms: "Private Rooms",
  session_booking: "Session Booking",
};

const FEATURE_PRIORITY: FeatureKey[] = [
  "private_rooms",
  "screen_share",
  "whiteboard",
  "video_audio",
  "session_booking",
  "code_editor",
  "chat",
  "notes",
  "polls",
];

const LIMIT_KEYS: LimitKey[] = [
  "max_participants",
  "max_active_rooms",
  "max_session_hours",
];

const LIMIT_FULL_LABELS: Record<LimitKey, (value: number) => string> = {
  max_participants: (v) => `Up to ${v} Participants`,
  max_active_rooms: (v) => `Up to ${v} Active Rooms`,
  max_session_hours: (v) => `Up to ${v} Hour Sessions`,
};

/** Fixed height for description block — fits max admin length without shifting layout. */
const DESCRIPTION_SLOT_CLASS = "h-[3.75rem] shrink-0 overflow-hidden";

// ─── Plan comparison ──────────────────────────────────────────────────────────

function sortFeatures(features: FeatureKey[]): FeatureKey[] {
  return [...features].sort((a, b) => {
    const ai = FEATURE_PRIORITY.indexOf(a);
    const bi = FEATURE_PRIORITY.indexOf(b);
    return (ai === -1 ? FEATURE_PRIORITY.length : ai) - (bi === -1 ? FEATURE_PRIORITY.length : bi);
  });
}

function getLimitValue(plan: PlanView, key: LimitKey): number {
  const value = plan.limits[key];
  return typeof value === "number" && value > 0 ? value : 0;
}

function getIncludedLimitLines(plan: PlanView): string[] {
  return LIMIT_KEYS.filter((key) => getLimitValue(plan, key) > 0).map((key) =>
    LIMIT_FULL_LABELS[key](getLimitValue(plan, key))
  );
}

function getNewLimitLines(current: PlanView, previous: PlanView): string[] {
  return LIMIT_KEYS.filter((key) => {
    const prev = getLimitValue(previous, key);
    const curr = getLimitValue(current, key);
    return curr > prev && curr > 0;
  }).map((key) => LIMIT_FULL_LABELS[key](getLimitValue(current, key)));
}

function getPlanFeatureSection(
  plan: PlanView,
  previousPlan: PlanView | null
): { title: string; items: string[] } {
  if (!previousPlan) {
    const items = [
      ...sortFeatures(plan.features).map((key) => FEATURE_LABELS[key] ?? key),
      ...getIncludedLimitLines(plan),
    ];
    return { title: "Included Features", items };
  }

  const newFeatures = sortFeatures(plan.features)
    .filter((key) => !previousPlan.features.includes(key))
    .map((key) => FEATURE_LABELS[key] ?? key);

  const items = [...newFeatures, ...getNewLimitLines(plan, previousPlan)];

  return { title: "New in this Plan", items };
}

// ─── Price formatting ─────────────────────────────────────────────────────────

function getCurrencySymbol(currency: string): string {
  switch (currency.toUpperCase()) {
    case "USD":
      return "$";
    case "INR":
      return "₹";
    default:
      return "$";
  }
}

function formatPrice(plan: PlanView, billing: PlanBillingInterval): {
  amount: string;
  period: string;
} {
  const price = billing === "monthly" ? plan.pricing.monthly : plan.pricing.yearly;
  const symbol = getCurrencySymbol(plan.pricing.currency);

  if (price === 0) {
    return { amount: `${symbol}0`, period: billing === "monthly" ? "/month" : "/year" };
  }

  const formatted = price.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return {
    amount: `${symbol}${formatted}`,
    period: billing === "monthly" ? "/month" : "/year",
  };
}

function getPricingGridClass(planCount: number): string {
  const base = "grid w-full items-stretch gap-6";

  if (planCount <= 1) return `${base} grid-cols-1 max-w-md mx-auto`;
  if (planCount === 2) return `${base} grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto`;
  if (planCount === 3) return `${base} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto`;
  return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-w-7xl mx-auto`;
}

// ─── UI pieces ──────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="flex h-full animate-pulse flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
    <div className="mb-3 h-4 w-20 rounded bg-zinc-800" />
    <div className="mb-2 h-6 w-28 rounded bg-zinc-800" />
    <div className={`mb-3 rounded bg-zinc-800/50 ${DESCRIPTION_SLOT_CLASS}`} />
    <div className="mb-4 h-10 w-32 rounded bg-zinc-800" />
    <div className="mb-4 h-10 w-full rounded-lg bg-zinc-800" />
    <div className="mb-4 h-px bg-zinc-800" />
    <div className="flex-1 space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-3 rounded bg-zinc-800/60" />
      ))}
    </div>
  </div>
);

const FeatureRow = ({ label, accent }: { label: string; accent?: boolean }) => (
  <li className="flex items-start gap-2.5 text-sm leading-snug text-zinc-300">
    <Check
      className={`mt-0.5 h-4 w-4 shrink-0 ${accent ? "text-indigo-400" : "text-zinc-500"}`}
      strokeWidth={2.5}
    />
    <span>{label}</span>
  </li>
);

interface PlanCardProps {
  plan: PlanView;
  previousPlan: PlanView | null;
  billing: PlanBillingInterval;
  isPopular: boolean;
  index: number;
  checkoutLoading: boolean;
  onCheckout: (plan: PlanView, billingInterval: PlanBillingInterval) => void;
}

const PlanCard = ({
  plan,
  previousPlan,
  billing,
  isPopular,
  index,
  checkoutLoading,
  onCheckout,
}: PlanCardProps) => {
  const navigate = useNavigate();
  const price = billing === "monthly" ? plan.pricing.monthly : plan.pricing.yearly;
  const isFree = price === 0;
  const { amount, period } = formatPrice(plan, billing);
  const tagline = plan.description?.trim() ?? "";
  const { title: featureTitle, items: featureItems } = getPlanFeatureSection(plan, previousPlan);

  const yearlySavings =
    billing === "yearly" && !isFree
      ? Math.round((1 - plan.pricing.yearly / (plan.pricing.monthly * 12)) * 100)
      : null;

  const handleCTA = () => {
    if (isFree) {
      navigate("/register");
      return;
    }
    onCheckout(plan, billing);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`relative flex h-full flex-col rounded-2xl border p-5 ${
        isPopular
          ? "z-10 border-indigo-500/70 bg-zinc-950 shadow-[0_0_24px_rgba(99,102,241,0.08)] md:scale-[1.03]"
          : "border-zinc-800/90 bg-zinc-950"
      }`}
    >
      <div className="mb-2 h-5 shrink-0">
        {isPopular && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400">
            <Zap className="h-3 w-3" />
            Most Popular
          </span>
        )}
      </div>

      <h3 className="shrink-0 text-base font-semibold tracking-tight text-white">{plan.name}</h3>

      <div className={`mt-1.5 ${DESCRIPTION_SLOT_CLASS}`}>
        <p className="text-sm leading-snug text-zinc-500">{tagline || "\u00A0"}</p>
      </div>

      <div className="mt-3 shrink-0 min-h-[3.25rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${plan.id}-${billing}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <p className="flex items-baseline gap-1.5">
              <span className="text-[2.125rem] font-bold leading-none tracking-tight tabular-nums text-white sm:text-5xl">
                {amount}
              </span>
              <span className="pb-0.5 text-sm text-zinc-500">{period}</span>
            </p>
            <p className="mt-1 h-4 text-xs text-emerald-400/90">
              {yearlySavings !== null ? `Save ${yearlySavings}% billed yearly` : ""}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={handleCTA}
        disabled={!isFree && checkoutLoading}
        className={`mt-4 w-full shrink-0 rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          isPopular
            ? "bg-indigo-600 py-2.5 text-white hover:bg-indigo-500"
            : "border border-zinc-700 bg-transparent py-2.5 text-white hover:border-zinc-500 hover:bg-zinc-900"
        }`}
      >
        {!isFree && checkoutLoading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting…
          </span>
        ) : isFree ? (
          "Get Started"
        ) : (
          `Get ${plan.name}`
        )}
      </button>

      <hr className="mt-4 mb-4 shrink-0 border-zinc-800" />

      <div className="flex min-h-0 flex-1 flex-col">
        <p className="mb-2.5 shrink-0 text-sm font-semibold text-zinc-300">
          {featureTitle}
        </p>
        {featureItems.length > 0 ? (
          <ul className="space-y-2">
            {featureItems.map((label, i) => (
              <FeatureRow key={`${plan.id}-f-${i}`} label={label} accent={isPopular} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-600">
            Same capabilities as the previous plan with updated limits.
          </p>
        )}
      </div>
    </motion.article>
  );
};

// ─── Page ───────────────────────────────────────────────────────────────────────

const PricingPage = () => {
  const [billing, setBilling] = useState<PlanBillingInterval>("monthly");
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { plans, loading, error } = useFetchPublicPlans();
  const { startCheckout, loading: checkoutLoading } = useSubscriptionCheckout();

  const handleCheckout = (plan: PlanView, billingInterval: PlanBillingInterval) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }
    void startCheckout({ planSlug: plan.slug, billingInterval });
  };

  const popularIndex = Math.floor(plans.length / 2);
  const skeletonCount = Math.max(plans.length, 3);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <header className="mb-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Pricing
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Simple plans that scale with your team.
            </p>
          </header>

          <div className="mb-5 flex justify-center">
            <div
              role="tablist"
              aria-label="Billing period"
              className="inline-flex rounded-full border border-zinc-800 bg-zinc-950 p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={billing === "monthly"}
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  billing === "monthly"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={billing === "yearly"}
                onClick={() => setBilling("yearly")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  billing === "yearly"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

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
      <Footer />
    </>
  );
};

export default PricingPage;
