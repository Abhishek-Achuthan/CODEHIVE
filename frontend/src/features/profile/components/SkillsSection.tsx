import { Pencil, Plus, X } from "lucide-react";

import type { SkillsData } from "../types";
import SectionCard from "./SectionCard";
import type { SectionMode } from "./AboutSection";

export interface SkillsSectionProps {
  mode: SectionMode;
  value: SkillsData;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onInputChange: (value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
}

export default function SkillsSection({
  mode,
  value,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onInputChange,
  onAddSkill,
  onRemoveSkill,
}: SkillsSectionProps) {
  return (
    <SectionCard
      title="Skills"
      rightAction={
        mode === "view" ? (
          <button
            type="button"
            onClick={onStartEdit}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
            aria-label="Edit skills"
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
      <div className="flex flex-wrap gap-2">
        {value.skills.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-950/60 px-3 py-1 text-xs text-gray-200"
          >
            {s}
            {mode === "edit" ? (
              <button
                type="button"
                onClick={() => onRemoveSkill(s)}
                className="text-gray-400 hover:text-white"
                aria-label={`Remove ${s}`}
              >
                ×
              </button>
            ) : null}
          </span>
        ))}
      </div>

      {mode === "edit" ? (
        <div className="mt-4 flex items-center gap-2">
          <input
            value={value.inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Add a skill"
            className="h-9 flex-1 rounded-md border border-gray-700 bg-black px-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-600/40"
          />
          <button
            type="button"
            onClick={onAddSkill}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>

          <div className="ml-auto flex items-center gap-2">
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
      ) : (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onStartEdit}
            className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      )}
    </SectionCard>
  );
}
