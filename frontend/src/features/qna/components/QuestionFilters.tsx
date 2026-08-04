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
    `px-3 py-2 text-sm font-medium transition-colors relative ${
      activeFilter === key
        ? "text-indigo-400"
        : "text-zinc-400 hover:text-zinc-200"
    }`;

  const handleSelect = (key: string): void => {
    onSelect(key);
  };

  return (
    <div className="flex flex-wrap items-center justify-between w-full gap-4">
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => handleSelect(f.key)}
            className={buttonClass(f.key)}
          >
            {f.label}
            {activeFilter === f.key && (
              <span className="absolute bottom-[-16px] left-0 w-full h-[2px] bg-indigo-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onOpenAdvanced}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          activeFilter === "filter"
            ? "bg-indigo-500/10 text-indigo-400"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
        }`}
      >
        <Sliders className="h-4 w-4" />
        <span className="hidden sm:inline">Advanced Filter</span>
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>
  );
}
