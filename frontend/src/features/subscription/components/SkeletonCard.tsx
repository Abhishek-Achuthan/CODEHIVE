import { DESCRIPTION_SLOT_CLASS } from "../utils/pricingUtils";

export const SkeletonCard = () => (
  <div className="flex h-full animate-pulse flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
    <div className="mb-3 h-4 w-20 rounded bg-zinc-800" />
    <div className="mb-2 h-6 w-28 rounded bg-zinc-800" />
    <div className={`mb-3 rounded bg-zinc-800/50 ${DESCRIPTION_SLOT_CLASS}`} />
    <div className="mb-4 h-10 w-32 rounded bg-zinc-800" />
    <div className="mb-4 h-10 w-full rounded-lg bg-zinc-800" />
    <div className="mb-4 h-px bg-zinc-800" />
    <div className="flex-1 space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-3 rounded bg-zinc-800/60" />
      ))}
    </div>
  </div>
);
