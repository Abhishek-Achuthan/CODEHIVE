import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";
import { CreditCard, ArrowRight } from "lucide-react";

export interface PlanBillingCardProps {
  currentPlanLabel: string;
  renewalDateLabel: string;
  statusLabel?: string;
  badgeLabel: string;
  cancelAtPeriodEnd?: boolean;
  loading?: boolean;
}

export default function PlanBillingCard({
  currentPlanLabel,
  renewalDateLabel,
  statusLabel,
  badgeLabel,
  cancelAtPeriodEnd = false,
  loading = false,
}: PlanBillingCardProps) {
  return (
    <SectionCard
      title="Plan & Billing"
      rightAction={
        <span className="rounded-md border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-[11px] font-semibold text-zinc-200">
          {badgeLabel}
        </span>
      }
    >
      {loading ? (
        <div className="space-y-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-800" />
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
            <div className="flex items-center gap-3 text-zinc-400">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">Current Plan</span>
            </div>
            <span className="text-zinc-100 font-semibold">{currentPlanLabel}</span>
          </div>

          {statusLabel && (
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-zinc-400">Status</span>
              <span className="text-sm font-semibold capitalize text-zinc-100">{statusLabel}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-medium text-zinc-400">
              {cancelAtPeriodEnd ? "Access until" : "Renewal date"}
            </span>
            <span className="text-sm font-semibold text-zinc-100">{renewalDateLabel}</span>
          </div>

          {cancelAtPeriodEnd && (
            <p className="px-2 text-[13px] text-amber-500/90 font-medium">
              Your subscription will not renew after this date.
            </p>
          )}

          <div className="pt-2">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo-400 transition-colors hover:text-indigo-300 px-2"
            >
              View plans & billing <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
