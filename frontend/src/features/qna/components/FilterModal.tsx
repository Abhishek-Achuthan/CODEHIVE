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
    <div className="mt-4 rounded-xl border border-zinc-800 bg-[#121214] px-6 py-6 shadow-xl mb-4" >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-zinc-100">
          Advanced Filters
        </h2>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-zinc-400 mb-8">
        Narrow down the list of questions using the criteria below.
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Status */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Status</h3>
          <div className="space-y-3 text-sm text-zinc-300">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="status"
                value="all"
                checked={form.status === "all"}
                onChange={() =>
                  setForm((prev) => ({ ...prev, status: "all" }))
                }
                className="w-4 h-4 text-indigo-600 bg-zinc-900 border-zinc-700 focus:ring-indigo-600/50 focus:ring-offset-zinc-900"
              />
              <span className="group-hover:text-zinc-100 transition-colors">All Questions</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="status"
                value="answered"
                checked={form.status === "answered"}
                onChange={() =>
                  setForm((prev) => ({ ...prev, status: "answered" }))
                }
                className="w-4 h-4 text-indigo-600 bg-zinc-900 border-zinc-700 focus:ring-indigo-600/50 focus:ring-offset-zinc-900"
              />
              <span className="group-hover:text-zinc-100 transition-colors">Answered</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="status"
                value="unanswered"
                checked={form.status === "unanswered"}
                onChange={() =>
                  setForm((prev) => ({ ...prev, status: "unanswered" }))
                }
                className="w-4 h-4 text-indigo-600 bg-zinc-900 border-zinc-700 focus:ring-indigo-600/50 focus:ring-offset-zinc-900"
              />
              <span className="group-hover:text-zinc-100 transition-colors">Unanswered</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">
            Tags
          </h3>
          <input
            type="text"
            placeholder="e.g., react, javascript"
            value={tagsText}
            onChange={(e) => {
              setTagsText(e.target.value);
            }}
            className="w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
          />
          <p className="text-xs text-zinc-500 mt-2">Comma-separated keywords.</p>
        </div>

        {/* Date */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Posted After</h3>
          <input
            type="date"
            value={form.dateFrom}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, dateFrom: e.target.value }))
            }
            className="w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-zinc-800 flex justify-between items-center">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-zinc-800 bg-transparent text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        >
          Reset Filters
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
