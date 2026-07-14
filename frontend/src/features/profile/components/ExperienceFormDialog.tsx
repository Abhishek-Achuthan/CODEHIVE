import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/dialog/Dialog";

import type { ExperienceDraftItem, ExperienceType } from "../types";

export interface ExperienceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: ExperienceDraftItem;
  onChange: (value: ExperienceDraftItem) => void;
  onSave: () => void;
}

export default function ExperienceFormDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSave,
}: ExperienceFormDialogProps) {
  const setField = <K extends keyof ExperienceDraftItem>(
    key: K,
    next: ExperienceDraftItem[K]
  ) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-zinc-800 bg-[#121214] text-zinc-100 p-0 overflow-hidden sm:max-w-md shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-zinc-800 bg-[#09090b]/50">
          <DialogTitle className="text-lg font-semibold tracking-tight">Experience</DialogTitle>
        </DialogHeader>

        <div className="p-6 grid gap-5">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-zinc-300">Type</span>
            <select
              value={value.type}
              onChange={(e) => setField("type", e.target.value as ExperienceType)}
              className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors appearance-none"
            >
              <option value="job">Job</option>
              <option value="freelance">Freelance</option>
              <option value="open_source">Open source</option>
              <option value="teaching">Teaching</option>
              <option value="self_learning">Self learning</option>
            </select>
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-zinc-300">Title</span>
            <input
              value={value.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-zinc-300">Organization</span>
            <input
              value={value.organization ?? ""}
              onChange={(e) => setField("organization", e.target.value)}
              placeholder="e.g. Google"
              className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-zinc-300">Start Date</span>
              <input
                type="text"
                value={value.startDate ?? ""}
                onChange={(e) => setField("startDate", e.target.value)}
                placeholder="YYYY-MM"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-zinc-300">End Date</span>
              <input
                type="text"
                value={value.endDate ?? ""}
                onChange={(e) => setField("endDate", e.target.value)}
                disabled={Boolean(value.isCurrent)}
                placeholder="YYYY-MM"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </label>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-zinc-300 mt-1 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={Boolean(value.isCurrent)}
              onChange={(e) => setField("isCurrent", e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-zinc-900 cursor-pointer"
            />
            I currently work here
          </label>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-zinc-800 bg-[#09090b]/50 flex gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="w-full sm:w-auto rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm"
          >
            Save Experience
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
