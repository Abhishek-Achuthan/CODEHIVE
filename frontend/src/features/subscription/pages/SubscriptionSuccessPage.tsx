import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import {
  formatBillingIntervalLabel,
  formatSubscriptionDate,
  useMySubscription,
} from "../hooks/useMySubscription";
import { triggerCelebrationConfetti } from "../../../shared/utils/confetti";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 8;

export default function SubscriptionSuccessPage() {
  const navigate = useNavigate();
  const { subscription, loading, refetch } = useMySubscription();
  const [polling, setPolling] = useState(true);
  const confettiFiredRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (subscription) {
      setPolling(false);
      return;
    }

    if (!loading && !subscription) {
      let attempts = 0;
      const interval = window.setInterval(async () => {
        attempts += 1;
        const result = await refetch();
        if (result || attempts >= MAX_POLL_ATTEMPTS) {
          setPolling(false);
          window.clearInterval(interval);
        }
      }, POLL_INTERVAL_MS);

      return () => window.clearInterval(interval);
    }
  }, [loading, refetch, subscription]);

  const isActivating = polling || (loading && !subscription);

  useEffect(() => {
    if (!isActivating && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      triggerCelebrationConfetti();
    }
  }, [isActivating]);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-8 sm:p-10"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            {isActivating ? (
              <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
            ) : (
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            )}
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {isActivating ? "Activating your subscription" : "Payment successful"}
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {isActivating
              ? "Your payment was received. We are confirming your subscription — this usually takes a few seconds."
              : subscription
              ? `You are now on ${subscription.plan.name} (${formatBillingIntervalLabel(subscription.billingInterval)}).`
              : "Your payment was received. Your subscription will appear in your profile shortly."}
          </p>

          {subscription && (
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left text-sm">
              <div className="flex justify-between gap-4 py-1.5">
                <span className="text-zinc-500">Plan</span>
                <span className="font-medium text-white">
                  {subscription.plan.name} ({formatBillingIntervalLabel(subscription.billingInterval)})
                </span>
              </div>
              <div className="flex justify-between gap-4 py-1.5">
                <span className="text-zinc-500">Status</span>
                <span className="font-medium capitalize text-white">
                  {subscription.status.toLowerCase().replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between gap-4 py-1.5">
                <span className="text-zinc-500">Renews on</span>
                <span className="font-medium text-white">
                  {formatSubscriptionDate(subscription.currentPeriodEnd)}
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              View profile
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
            >
              Back to pricing
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
