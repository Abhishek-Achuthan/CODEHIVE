import { Sliders, ChevronDown } from "lucide-react";

type Props = {
  activeFilter: string;
  onSelect: (type: string) => void;
  onOpenAdvanced: () => void;
};

export function QuestionFilters({
  activeFilter,
  onSelect,
  onOpenAdvanced,
}: Props) {
  const filters = [
    { key: "newest", label: "Newest" },
    { key: "answered", label: "Answered" },
    { key: "unanswered", label: "Unanswered" },
    { key: "most-voted", label: "Most Voted" },
    { key: "most-answered", label: "Most Answered" },
    { key: "most-viewed", label: "Most Viewed" },
  ];

  const buttonClass = (key: string): string =>
    `px-4 py-2.5 text-xs font-semibold transition-all duration-300 focus:outline-none ${
      activeFilter === key
        ? "bg-indigo-500/15 text-indigo-400 shadow-[inset_0_-2px_0_rgba(99,102,241,1)]"
        : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
    }`;

  const filterButtonClass = (active: boolean): string =>
    `inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
      active
        ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
        : "border-white/10 bg-black/40 text-gray-400 hover:border-white/20 hover:text-gray-200"
    }`;

  const handleSelect = (key: string): void => {
    onSelect(key);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="inline-flex overflow-hidden rounded-lg border border-zinc-800 divide-x divide-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
        {filters.map((f, idx) => (
          <button
            key={f.key}
            onClick={() => handleSelect(f.key)}
            className={[
              buttonClass(f.key),
              idx === 0 ? "rounded-l-lg" : "",
              idx === filters.length - 1 ? "rounded-r-lg" : "",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={onOpenAdvanced}
        className={filterButtonClass(activeFilter === "filter")}
      >
        <Sliders className="h-4 w-4" />
        <span className="hidden sm:inline">Advanced Filter</span>
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>
  );
}
