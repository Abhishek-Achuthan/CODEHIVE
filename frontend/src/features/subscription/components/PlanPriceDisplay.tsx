import { PRICE_DISPLAY_CLASS } from "../utils/pricingUtils";

interface PlanPriceDisplayProps {
  symbol: string;
  value: string;
  period: string;
}

export const PlanPriceDisplay = ({ symbol, value, period }: PlanPriceDisplayProps) => (
  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
    <span
      className={`inline-flex items-baseline gap-x-px font-sans ${PRICE_DISPLAY_CLASS}`}
      aria-label={`${symbol}${value}${period}`}
    >
      <span
        className={`shrink-0 tabular-nums [font-feature-settings:'tnum'] ${
          symbol === "₹" ? "relative top-px" : ""
        }`}
      >
        {symbol}
      </span>
      <span className="tabular-nums [font-feature-settings:'tnum']">{value}</span>
    </span>
    <span className="pb-0.5 text-sm font-normal leading-none text-zinc-500">{period}</span>
  </p>
);
