import { useState, type JSX } from "react";

export type FilterState = {
  status: "all" | "answered" | "unanswered";
  tags: string[];
  dateFrom: string;
};

type FilterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: FilterState) => void;
};

const defaultState: FilterState = {
  status: "all",
  tags: [],
  dateFrom: "",
};

export function FilterModal({
  open,
  onOpenChange,
  onApply,
}: FilterModalProps): JSX.Element | null {
  const [form, setForm] = useState<FilterState>(defaultState);
  const [tagsText, setTagsText] = useState<string>("");

  if (!open) return null;

  const handleReset = (): void => {
    setForm(defaultState);
    setTagsText("");
    onApply(defaultState);
    onOpenChange(false);
  };

  const handleApply = (): void => {
    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onApply({ ...form, tags });
    onOpenChange(false);
  };

  return (
    <div className="mt-4 rounded-xl border border-border bg-card/90 px-6 py-5 shadow-lg mb-4" >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Filter Questions
        </h2>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="text-foreground/60 hover:text-foreground text-sm"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-foreground/60 mb-4">
        Narrow down the list of questions using the filters below.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Status */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Status</h3>
          <div className="space-y-2 text-sm text-foreground/80">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="all"
                checked={form.status === "all"}
                onChange={() =>
                  setForm((prev) => ({ ...prev, status: "all" }))
                }
              />
              <span>All Questions</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="answered"
                checked={form.status === "answered"}
                onChange={() =>
                  setForm((prev) => ({ ...prev, status: "answered" }))
                }
              />
              <span>Answered</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="unanswered"
                checked={form.status === "unanswered"}
                onChange={() =>
                  setForm((prev) => ({ ...prev, status: "unanswered" }))
                }
              />
              <span>Unanswered</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">
            Tags (comma-separated)
          </h3>
          <input
            type="text"
            placeholder="e.g., react, javascript, typescript"
            value={tagsText}
            onChange={(e) => {
              setTagsText(e.target.value);
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>

        {/* Date */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Date</h3>
          <input
            type="date"
            value={form.dateFrom}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, dateFrom: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-border text-sm text-foreground/80 hover:bg-card/80"
        >
          Reset
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg border border-border text-sm text-foreground/80 hover:bg-card/80"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 border border-white"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
