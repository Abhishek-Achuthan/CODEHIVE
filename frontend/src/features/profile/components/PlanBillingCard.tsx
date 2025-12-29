import SectionCard from "./SectionCard";

export interface PlanBillingCardProps {
  currentPlanLabel: string;
  renewalDateLabel: string;
  badgeLabel: string;
}

export default function PlanBillingCard({
  currentPlanLabel,
  renewalDateLabel,
  badgeLabel,
}: PlanBillingCardProps) {
  return (
    <SectionCard
      title="Plan & Billing"
      rightAction={
        <span className="rounded-md bg-gray-900 px-2 py-1 text-[11px] font-semibold text-gray-200 border border-gray-700">
          {badgeLabel}
        </span>
      }
    >
      <div className="grid gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Current Plan</span>
          <span className="text-white font-semibold">{currentPlanLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Renewal date</span>
          <span className="text-white font-semibold">{renewalDateLabel}</span>
        </div>
      </div>
    </SectionCard>
  );
}
