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
import type { PlanView, FeatureKey } from "../../../shared/types/view/PlanView";
import type { PlanBillingInterval } from "../../../shared/types/api/subscription";

// ─── Feature label map ────────────────────────────────────────────────────────

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

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-8 animate-pulse">
    <div className="h-5 w-24 bg-zinc-800 rounded mb-6" />
    <div className="h-12 w-32 bg-zinc-800 rounded mb-4" />
    <div className="h-4 w-48 bg-zinc-800/60 rounded mb-8" />
    <div className="h-11 w-full bg-zinc-800 rounded-xl mb-8" />
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-zinc-800 flex-shrink-0" />
          <div className="h-3 bg-zinc-800/60 rounded flex-1" style={{ width: `${60 + i * 8}%` }} />
        </div>
      ))}
    </div>
  </div>
);

// ─── Plan card ────────────────────────────────────────────────────────────────

interface PlanCardProps {
  plan: PlanView;
  billing: PlanBillingInterval;
  isPopular: boolean;
  index: number;
  checkoutLoading: boolean;
  onCheckout: (plan: PlanView, billingInterval: PlanBillingInterval) => void;
}

const PlanCard = ({
  plan,
  billing,
  isPopular,
  index,
  checkoutLoading,
  onCheckout,
}: PlanCardProps) => {
  const navigate = useNavigate();
  const price = billing === "monthly" ? plan.pricing.monthly : plan.pricing.yearly;
  const isFree = price === 0;

  const handleCTA = () => {
    if (isFree) {
      navigate("/register");
      return;
    }

    onCheckout(plan, billing);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
        isPopular
          ? "bg-zinc-900 border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.12)] scale-[1.02]"
          : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
      }`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold tracking-wide shadow-lg shadow-indigo-500/30">
            <Zap className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
        {plan.description && (
          <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{plan.description}</p>
        )}
      </div>

      {/* Price */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${plan.id}-${billing}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="mb-2"
        >
          <div className="flex items-end gap-1">
            <span className="text-5xl font-extrabold text-white tracking-tight">
              {isFree
                ? "$0"
                : `${plan.pricing.currency === "USD" ? "$" : plan.pricing.currency}${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
            {!isFree && (
              <span className="text-zinc-500 text-sm mb-2">
                /{billing === "monthly" ? "mo" : "yr"}
              </span>
            )}
          </div>
          {billing === "yearly" && !isFree && (
            <p className="text-xs text-emerald-400 font-medium mt-1">
              Save {Math.round((1 - plan.pricing.yearly / (plan.pricing.monthly * 12)) * 100)}% vs monthly
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <button
        onClick={handleCTA}
        disabled={!isFree && checkoutLoading}
        className={`w-full mt-6 mb-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
          isPopular
            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95"
            : isFree
            ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600"
            : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600"
        }`}
      >
        {!isFree && checkoutLoading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting…
          </span>
        ) : isFree ? (
          "Get Started for Free"
        ) : (
          `Get ${plan.name}`
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
          Features
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Feature list */}
      <ul className="space-y-3 flex-1">
        {plan.features.map((featureKey) => (
          <li key={featureKey} className="flex items-center gap-3">
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                isPopular ? "bg-indigo-500/20" : "bg-zinc-800"
              }`}
            >
              <Check
                className={`w-2.5 h-2.5 ${isPopular ? "text-indigo-400" : "text-zinc-400"}`}
                strokeWidth={3}
              />
            </span>
            <span className="text-sm text-zinc-300">
              {FEATURE_LABELS[featureKey] ?? featureKey}
            </span>
          </li>
        ))}

        {/* Limits */}
        {Object.entries(plan.limits).map(([key, value]) => {
          if (!value) return null;
          const label =
            key === "max_participants"
              ? `Up to ${value} participants`
              : key === "max_active_rooms"
              ? `${value} active rooms`
              : key === "max_session_hours"
              ? `${value}h max session`
              : null;
          if (!label) return null;
          return (
            <li key={key} className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isPopular ? "bg-indigo-500/20" : "bg-zinc-800"
                }`}
              >
                <Check
                  className={`w-2.5 h-2.5 ${isPopular ? "text-indigo-400" : "text-zinc-400"}`}
                  strokeWidth={3}
                />
              </span>
              <span className="text-sm text-zinc-300">{label}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

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

  // The middle plan (by sortOrder) is "most popular"
  const popularIndex = Math.floor(plans.length / 2);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white">
        {/* Background glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[5%] w-[350px] h-[350px] bg-indigo-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Hero text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Transparent pricing, no surprises
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-5">
              Simple and Affordable
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                Pricing Plans
              </span>
            </h1>

            <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
              Start for free and upgrade as your team grows. Every plan includes
              access to CodeHive's core collaboration tools.
            </p>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-16"
          >
            <span
              className={`text-sm font-medium transition-colors ${
                billing === "monthly" ? "text-white" : "text-zinc-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))
              }
              className={`relative w-12 h-6 rounded-full border transition-all duration-300 ${
                billing === "yearly"
                  ? "bg-indigo-600 border-indigo-500"
                  : "bg-zinc-800 border-zinc-700"
              }`}
              aria-label="Toggle billing period"
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                  billing === "yearly" ? "left-6" : "left-0.5"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${
                billing === "yearly" ? "text-white" : "text-zinc-500"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full">
                SAVE UP TO 20%
              </span>
            </span>
          </motion.div>

          {/* Cards grid */}
          {loading ? (
            <div
              className={`grid gap-6 ${
                [1, 2, 3].length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                  : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-zinc-600" />
              </div>
              <p className="text-zinc-500 text-sm">{error}</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-24 text-zinc-600 text-sm">
              No plans available right now. Check back soon.
            </div>
          ) : (
            <div
              className={`grid gap-6 items-start ${
                plans.length === 1
                  ? "grid-cols-1 max-w-sm mx-auto"
                  : plans.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                  : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {plans.map((plan, i) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  billing={billing}
                  isPopular={i === popularIndex && plans.length > 1}
                  index={i}
                  checkoutLoading={checkoutLoading}
                  onCheckout={handleCheckout}
                />
              ))}
            </div>
          )}

          {/* Bottom note */}
          {!loading && !error && plans.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-zinc-600 text-sm mt-12"
            >
              All plans include a 14-day free trial. No credit card required to start.
            </motion.p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PricingPage;
