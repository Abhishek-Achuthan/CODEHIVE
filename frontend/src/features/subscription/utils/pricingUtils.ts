import type { PlanView, FeatureKey, LimitKey } from "../../../shared/types/view/PlanView";
import type { PlanBillingInterval } from "../../../shared/types/api/subscription";

export const FEATURE_LABELS: Record<FeatureKey, string> = {
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

export const FEATURE_PRIORITY: FeatureKey[] = [
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

export const LIMIT_KEYS: LimitKey[] = [
  "max_participants",
  "max_active_rooms",
  "max_session_hours",
];

export const LIMIT_FULL_LABELS: Record<LimitKey, (value: number) => string> = {
  max_participants: (v) => `Up to ${v} Participants`,
  max_active_rooms: (v) => `Up to ${v} Active Rooms`,
  max_session_hours: (v) => `Up to ${v} Hour Sessions`,
};

export const DESCRIPTION_SLOT_CLASS = "h-[3.75rem] shrink-0 overflow-hidden";
export const PRICE_DISPLAY_CLASS =
  "text-[2.125rem] font-bold leading-none tracking-tight text-white sm:text-5xl";

export function sortFeatures(features: FeatureKey[]): FeatureKey[] {
  return [...features].sort((a, b) => {
    const ai = FEATURE_PRIORITY.indexOf(a);
    const bi = FEATURE_PRIORITY.indexOf(b);
    return (ai === -1 ? FEATURE_PRIORITY.length : ai) - (bi === -1 ? FEATURE_PRIORITY.length : bi);
  });
}

export function getLimitValue(plan: PlanView, key: LimitKey): number {
  const value = plan.limits[key];
  return typeof value === "number" && value > 0 ? value : 0;
}

export function getIncludedLimitLines(plan: PlanView): string[] {
  return LIMIT_KEYS.filter((key) => getLimitValue(plan, key) > 0).map((key) =>
    LIMIT_FULL_LABELS[key](getLimitValue(plan, key))
  );
}

export function getNewLimitLines(current: PlanView, previous: PlanView): string[] {
  return LIMIT_KEYS.filter((key) => {
    const prev = getLimitValue(previous, key);
    const curr = getLimitValue(current, key);
    return curr > prev && curr > 0;
  }).map((key) => LIMIT_FULL_LABELS[key](getLimitValue(current, key)));
}

export function getPlanFeatureSection(
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

export function getCurrencySymbol(currency: string): string {
  switch (currency.toUpperCase()) {
    case "USD":
      return "$";
    case "INR":
      return "₹";
    default:
      return "$";
  }
}

export function formatPriceValue(price: number, currency: string): string {
  const locale = currency.toUpperCase() === "INR" ? "en-IN" : "en-US";
  return price.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatPrice(plan: PlanView, billing: PlanBillingInterval): {
  symbol: string;
  value: string;
  period: string;
} {
  const price = billing === "monthly" ? plan.pricing.monthly : plan.pricing.yearly;
  const currency = plan.pricing.currency;

  return {
    symbol: getCurrencySymbol(currency),
    value: formatPriceValue(price, currency),
    period: billing === "monthly" ? "/month" : "/year",
  };
}

export function getPricingGridClass(planCount: number): string {
  const base = "grid w-full items-stretch gap-6";

  if (planCount <= 1) return `${base} grid-cols-1 max-w-md mx-auto`;
  if (planCount === 2) return `${base} grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto`;
  if (planCount === 3) return `${base} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto`;
  return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-w-7xl mx-auto`;
}
