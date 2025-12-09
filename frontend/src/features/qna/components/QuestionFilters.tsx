import {
  Clock,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Sliders,
} from "lucide-react";

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
  const base =
    "px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-2 ";

  const active =
    "bg-primary/25 hover:bg-primary/40 text-primary border border-primary/40";
  const inactive =
    "bg-card hover:bg-card/80 text-foreground/70 border border-border";

  const btnClass = (key: string): string =>
    base + (activeFilter === key ? active : inactive);

  return (
    <>
      <button
        onClick={() => onSelect("newest")}
        className={btnClass("newest")}
      >
        <Clock className="w-3 h-3" /> Newest
      </button>

      <button
        onClick={() => onSelect("answered")}
        className={btnClass("answered")}
      >
        <CheckCircle2 className="w-3 h-3" /> Answered
      </button>

      <button
        onClick={() => onSelect("unanswered")}
        className={btnClass("unanswered")}
      >
        <HelpCircle className="w-3 h-3" /> Unanswered
      </button>

      <button
        onClick={() => onSelect("most-answered")}
        className={btnClass("most-answered")}
      >
        <BarChart3 className="w-3 h-3" /> Most answered
      </button>

      <button
        onClick={() => onSelect("most-voted")}
        className={btnClass("most-voted")}
      >
        <BarChart3 className="w-3 h-3" /> Most Voted
      </button>

      <button
        onClick={() => onSelect("most-viewed")}
        className={btnClass("most-viewed")}
      >
        <BarChart3 className="w-3 h-3" /> Most Viewed
      </button>

      <button
        onClick={onOpenAdvanced}
        className={
          base +
          (activeFilter === "filter"
            ? active
            : "bg-accent/20 hover:bg-accent/35 text-accent border border-accent/40")
        }
      >
        <Sliders className="w-3 h-3" /> Filter
      </button>
    </>
  );
}
