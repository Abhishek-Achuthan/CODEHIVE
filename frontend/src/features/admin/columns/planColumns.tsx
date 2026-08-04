import type { Column } from "../../../shared/ui/DataTable";
import type { PlanView } from "../../../shared/types/view/PlanView";

export const planColumns: readonly Column<PlanView>[] = [
  {
    header: "Name",
    key: "name",
    template: (_value, row) => (
      <div>
        <p className="font-semibold text-white">{row.name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{row.slug}</p>
      </div>
    ),
  },
  {
    header: "Pricing",
    key: "pricing",
    template: (_value, row) => (
      <div className="text-xs space-y-0.5">
        <p className="text-zinc-300">
          <span className="text-zinc-500">Monthly:</span>{" "}
          <span className="font-medium">
            {row.pricing.currency} {row.pricing.monthly}
          </span>
        </p>
        <p className="text-zinc-300">
          <span className="text-zinc-500">Yearly:</span>{" "}
          <span className="font-medium">
            {row.pricing.currency} {row.pricing.yearly}
          </span>
        </p>
      </div>
    ),
  },
  {
    header: "Features",
    key: "features",
    template: (_value, row) => (
      <span className="text-zinc-400 text-xs">
        {row.features.length} feature{row.features.length !== 1 ? "s" : ""}
      </span>
    ),
  },
  {
    header: "Visibility",
    key: "isPublic",
    template: (value) => {
      const isPublic = value as boolean;
      return (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            isPublic
              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
              : "bg-zinc-700/40 text-zinc-400 border border-white/5"
          }`}
        >
          {isPublic ? "Public" : "Private"}
        </span>
      );
    },
  },
  {
    header: "Status",
    key: "isActive",
    template: (value) => {
      const isActive = value as boolean;
      return (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            isActive
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {isActive ? "Active" : "Archived"}
        </span>
      );
    },
  },
  {
    header: "Order",
    key: "sortOrder",
    template: (value) => (
      <span className="text-zinc-400 text-xs">{String(value)}</span>
    ),
  },
] as const;
