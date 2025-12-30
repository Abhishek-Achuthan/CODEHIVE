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
      <DialogContent className="border border-gray-800 bg-black text-white">
        <DialogHeader>
          <DialogTitle>Experience</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-gray-400">Type</span>
            <select
              value={value.type}
              onChange={(e) => setField("type", e.target.value as ExperienceType)}
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/40"
            >
              <option value="job">Job</option>
              <option value="freelance">Freelance</option>
              <option value="open_source">Open source</option>
              <option value="teaching">Teaching</option>
              <option value="self_learning">Self learning</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-400">Title</span>
            <input
              value={value.title}
              onChange={(e) => setField("title", e.target.value)}
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/40"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-400">Organization</span>
            <input
              value={value.organization ?? ""}
              onChange={(e) => setField("organization", e.target.value)}
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/40"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-gray-400">Start date</span>
              <input
                type="month"
                value={value.startDate ?? ""}
                onChange={(e) => setField("startDate", e.target.value)}
                placeholder="2025-01"
                className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/40"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-gray-400">End date</span>
              <input
                type="month"
                value={value.endDate ?? ""}
                onChange={(e) => setField("endDate", e.target.value)}
                disabled={Boolean(value.isCurrent)}
                placeholder="2025-12"
                className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/40 disabled:opacity-50"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(value.isCurrent)}
              onChange={(e) => setField("isCurrent", e.target.checked)}
            />
            Current
          </label>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onSave}
            className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
