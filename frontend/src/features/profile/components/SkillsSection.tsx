import { useEffect, useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import SectionCard from "./SectionCard";

const SKILL_MAX_CHARS = 40;

export interface SkillsSectionProps {
  initialSkills: string[];
  onSave?: (skills: string[]) => Promise<void>;
  readonly?: boolean;
}

export default function SkillsSection({
  initialSkills,
  onSave,
  readonly = false,
}: SkillsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setSkills(initialSkills);
    }
  }, [initialSkills, isEditing]);

  const addSkill = () => {
    const raw = inputValue.replace(/\s+/g, " ").trim();
    if (!raw) return;
    if (raw.length > SKILL_MAX_CHARS) return;

    const exists = skills.some(
      (s) => s.toLowerCase() === raw.toLowerCase()
    );
    if (exists) {
      setInputValue("");
      return;
    }

    setSkills((prev) => [...prev, raw]);
    setInputValue("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave?.(skills);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSkills(initialSkills);
    setInputValue("");
    setIsEditing(false);
  };

  const canAdd = Boolean(inputValue.replace(/\s+/g, " ").trim()) &&
    inputValue.replace(/\s+/g, " ").trim().length <= SKILL_MAX_CHARS;

  return (
    <SectionCard
      title="Skills"
      rightAction={
        !readonly && (
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )
        )
      }
    >
      <div className="flex flex-wrap gap-3">
        {skills.length === 0 ? (
          <div className="w-full rounded-xl border border-dashed border-zinc-800 bg-[#09090b]/50 px-6 py-8 text-center">
            <div className="text-sm font-medium text-zinc-400">
              No skills added yet
            </div>
            <div className="mt-2 text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Add technologies you work with — e.g. React, Node.js, MongoDB, Docker.
            </div>
          </div>
        ) : (
          skills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-[13px] font-medium text-zinc-200 shadow-sm transition-colors hover:border-zinc-700"
            >
              {s}
              {isEditing && !readonly && (
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="text-zinc-500 hover:text-zinc-200 transition-colors -mr-1"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))
        )}
      </div>

      {isEditing && (
        <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 flex-1">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="e.g. Typescript, Next.js"
              maxLength={SKILL_MAX_CHARS}
              className="h-10 w-full sm:max-w-xs rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
            <button
              onClick={addSkill}
              disabled={!canAdd}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-800 px-4 text-sm font-medium text-zinc-100 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
