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
    [
      "px-3 py-2 text-xs font-medium transition focus:outline-none",
      "hover:bg-card/80 hover:text-foreground",
      activeFilter === key
        ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
        : "text-foreground/70",
    ].join(" ");

  const filterButtonClass = (active: boolean): string =>
    [
      "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition",
      active
        ? "border-primary/50 bg-primary/15 text-primary"
        : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-foreground",
    ].join(" ");

  const handleSelect = (key: string): void => {
    onSelect(key);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex overflow-hidden rounded-lg border border-border/70 divide-x divide-border/70 bg-card/60">
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
        <span className="hidden sm:inline">Filter</span>
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>
  );
}
