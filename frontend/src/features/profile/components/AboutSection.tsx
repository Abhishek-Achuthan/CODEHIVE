import { Pencil, X } from "lucide-react";

import type { AboutData } from "../types";
import SectionCard from "./SectionCard";

export type SectionMode = "view" | "edit";

export interface AboutSectionProps {
  mode: SectionMode;
  value: AboutData;
  draftText: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDraftChange: (text: string) => void;
}

export default function AboutSection({
  mode,
  value,
  draftText,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDraftChange,
}: AboutSectionProps) {
  return (
    <SectionCard
      title="About Me"
      rightAction={
        mode === "view" ? (
          <button
            type="button"
            onClick={onStartEdit}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
            aria-label="Edit about"
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        )
      }
    >
      {mode === "view" ? (
        <p className="text-xs leading-relaxed text-gray-300 line-clamp-3">
          {value.text}
        </p>
      ) : (
        <div className="grid gap-3">
          <textarea
            value={draftText}
            onChange={(e) => onDraftChange(e.target.value)}
            className="min-h-28 w-full resize-none rounded-lg border border-gray-700 bg-black px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-600/40"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-md border border-gray-600 px-4 py-2 text-xs font-medium text-white hover:bg-gray-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSaveEdit}
              className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
