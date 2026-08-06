import type { PlanBillingInterval } from "../../../shared/types/api/subscription";

interface BillingToggleProps {
  billing: PlanBillingInterval;
  onChange: (billing: PlanBillingInterval) => void;
}

export const BillingToggle = ({ billing, onChange }: BillingToggleProps) => (
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
        onClick={() => onChange("monthly")}
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
        onClick={() => onChange("yearly")}
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
);
