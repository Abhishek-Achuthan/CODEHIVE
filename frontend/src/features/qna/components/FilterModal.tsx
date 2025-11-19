import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../shared/ui/dialog/Dialog';
import { cn } from "../../../shared/utils/classNames";
import type { QuestionListFilter, QuestionStatus } from "../../../shared/types/qnaTypes"; 

export type FilterState = Partial<QuestionListFilter>;

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: FilterState) => void;
}

export function FilterModal({ open, onOpenChange, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    bookmarkedOnly: false,
    dateFrom: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (open) {
      setFilters({
        status: "all",
        bookmarkedOnly: false,
        dateFrom: "",
        tags: [],
      });
      setTagInput("");
    }
  }, [open]);

  const updateFilter = (key: keyof FilterState, value: any) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => {
    const cleaned: FilterState = { ...filters };
    
    const parsedTags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    if (parsedTags.length > 0) {
      cleaned.tags = parsedTags;
    } else {
      delete cleaned.tags;
    }

    if (!cleaned.dateFrom) delete cleaned.dateFrom;
    if (cleaned.status === "all") delete cleaned.status;

    onApply(cleaned);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      status: "all",
      dateFrom: "",
      tags: [],
    });
    setTagInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Filter Questions</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Narrow down the list of questions using the filters below.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Status</h3>
            <div className="space-y-2">
              {[
                { value: "all" as QuestionStatus, label: "All Questions" },
                { value: "answered" as QuestionStatus, label: "Answered" },
                { value: "unanswered" as QuestionStatus, label: "Unanswered" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={filters.status === option.value}
                    onChange={(e) => updateFilter("status", e.target.value as QuestionStatus)}
                    className="w-4 h-4 rounded border-border bg-background checked:bg-primary accent-primary"
                  />
                  <span className="text-sm text-foreground/70 group-hover:text-foreground transition">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Tags (comma-separated)</h3>
            <input
              type="text"
              placeholder="e.g., react, javascript, typescript"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Date</h3>
            <div className="grid grid-cols-1 gap-2">
              <input
                type="date"
                placeholder="From"
                value={filters.dateFrom || ""}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleReset}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-border bg-background hover:bg-background/80 transition"
            )}
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition"
            )}
          >
            Apply Filters
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}