import { useEffect, useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import SectionCard from "./SectionCard";

export interface SkillsSectionProps {
  initialSkills: string[];
  onSave: (skills: string[]) => Promise<void>;
}

export default function SkillsSection({
  initialSkills,
  onSave,
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
    const raw = inputValue.trim();
    if (!raw) return;

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
      await onSave(skills);
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

  return (
    <SectionCard
      title="Skills"
      rightAction={
        !isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
          >
            <X className="h-4 w-4" />
          </button>
        )
      }
    >
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-950/60 px-3 py-1 text-xs text-gray-200"
          >
            {s}
            {isEditing && (
              <button
                onClick={() => removeSkill(s)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>

      {isEditing && (
        <div className="mt-4 flex items-center gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a skill"
            className="h-9 flex-1 rounded-md border border-gray-700 bg-black px-3 text-sm text-white"
          />
          <button
            onClick={addSkill}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="rounded-md border border-gray-600 px-4 py-2 text-xs text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-xs text-white disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
