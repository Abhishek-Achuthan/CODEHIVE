import { motion, AnimatePresence } from "framer-motion";
import { Zap, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PlanView } from "../../../shared/types/view/PlanView";
import type { PlanBillingInterval } from "../../../shared/types/api/subscription";
import { getBillingSwitchLabel } from "../hooks/useMySubscription";
import {
  DESCRIPTION_SLOT_CLASS,
  formatPrice,
  getPlanFeatureSection,
} from "../utils/pricingUtils";
import { PlanPriceDisplay } from "./PlanPriceDisplay";
import { FeatureRow } from "./FeatureRow";

interface PlanCardProps {
  plan: PlanView;
  previousPlan: PlanView | null;
  billing: PlanBillingInterval;
  isPopular: boolean;
  isCurrentPlan: boolean;
  isBillingSwitch: boolean;
  isYearlyToMonthlyDowngrade?: boolean;
  index: number;
  checkoutLoading: boolean;
  onCheckout: (plan: PlanView, billingInterval: PlanBillingInterval) => void;
}

export const PlanCard = ({
  plan,
  previousPlan,
  billing,
  isPopular,
  isCurrentPlan,
  isBillingSwitch,
  isYearlyToMonthlyDowngrade,
  index,
  checkoutLoading,
  onCheckout,
}: PlanCardProps) => {
  const navigate = useNavigate();
  const price = billing === "monthly" ? plan.pricing.monthly : plan.pricing.yearly;
  const isFree = price === 0;
  const { symbol, value, period } = formatPrice(plan, billing);
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
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 420, damping: 28 },
      }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`relative flex h-full cursor-default flex-col rounded-2xl border p-5 transition-[border-color,background-color,box-shadow] duration-200 ${
        isCurrentPlan
          ? "border-emerald-500/50 bg-zinc-950 ring-1 ring-emerald-500/20"
          : isPopular
          ? "z-10 border-indigo-500/70 bg-zinc-950 shadow-[0_0_24px_rgba(99,102,241,0.08)] hover:border-indigo-400/90 hover:shadow-[0_0_28px_rgba(99,102,241,0.12)] md:scale-[1.03]"
          : "border-zinc-800/90 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900/40"
      }`}
    >
      <div className="mb-2 flex h-5 shrink-0 items-center gap-2">
        {isCurrentPlan && (
          <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
            Current Plan
          </span>
        )}
        {isPopular && !isCurrentPlan && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400">
            <Zap className="h-3 w-3" />
            Most Popular
          </span>
        )}
        {isPopular && isCurrentPlan && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400">
            <Zap className="h-3 w-3" />
            Popular
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
            <PlanPriceDisplay symbol={symbol} value={value} period={period} />
            <p className="mt-1 h-4 text-xs text-emerald-400/90">
              {yearlySavings !== null ? `Save ${yearlySavings}% billed yearly` : ""}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {isCurrentPlan ? (
        <p className="mt-4 shrink-0 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-center text-sm text-emerald-300/90">
          {isFree ? "You are on this plan." : "Your current plan"}
        </p>
      ) : isYearlyToMonthlyDowngrade ? (
        <button
          type="button"
          disabled
          className="mt-4 w-full shrink-0 rounded-lg border border-zinc-800 bg-zinc-900/60 py-2.5 text-center text-sm font-semibold text-zinc-500 cursor-not-allowed opacity-75"
        >
          Yearly plan active
        </button>
      ) : (
        <button
          type="button"
          onClick={handleCTA}
          disabled={!isFree && checkoutLoading}
          className={`mt-4 w-full shrink-0 rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            isBillingSwitch
              ? "border border-indigo-500/50 bg-indigo-500/10 py-2.5 text-indigo-300 hover:bg-indigo-500/20"
              : isPopular
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
          ) : isBillingSwitch ? (
            getBillingSwitchLabel(billing)
          ) : (
            `Get ${plan.name}`
          )}
        </button>
      )}

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
