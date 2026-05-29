import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";

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
        <span className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-[11px] font-semibold text-gray-200">
          {badgeLabel}
        </span>
      }
    >
      {loading ? (
        <div className="space-y-3">
          <div className="h-4 animate-pulse rounded bg-zinc-800" />
          <div className="h-4 animate-pulse rounded bg-zinc-800" />
        </div>
      ) : (
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-400">Current plan</span>
            <span className="font-semibold text-white">{currentPlanLabel}</span>
          </div>
          {statusLabel && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-400">Status</span>
              <span className="font-semibold capitalize text-white">{statusLabel}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-400">
              {cancelAtPeriodEnd ? "Access until" : "Renewal date"}
            </span>
            <span className="font-semibold text-white">{renewalDateLabel}</span>
          </div>
          {cancelAtPeriodEnd && (
            <p className="text-xs text-amber-400/90">
              Your subscription will not renew after this date.
            </p>
          )}
          <Link
            to="/pricing"
            className="mt-1 inline-block text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            View plans & billing →
          </Link>
        </div>
      )}
    </SectionCard>
  );
}
