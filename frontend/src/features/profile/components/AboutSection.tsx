import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import SectionCard from "./SectionCard";

const ABOUT_MAX_CHARS = 200;

export interface AboutSectionProps {
  initialText: string;
  onSave: (text: string) => Promise<void>;
}

export default function AboutSection({
  initialText,
  onSave,
}: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialText);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraft(initialText);
    }
  }, [initialText, isEditing]);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const normalized = trimmed.replace(/\s+/g, " ");

    try {
      setSaving(true);
      await onSave(normalized);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(initialText);
    setIsEditing(false);
  };

  return (
    <SectionCard
      title="About Me"
      rightAction={
        !isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
            aria-label="Edit about"
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        )
      }
    >
      {!isEditing ? (
        <p className="text-xs leading-relaxed text-gray-300">
          {initialText || "No description provided."}
        </p>
      ) : (
        <div className="grid gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={ABOUT_MAX_CHARS}
            className="min-h-28 w-full resize-none rounded-lg border border-gray-700 bg-black px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-600/40"
          />

          <div className="flex items-center justify-end gap-2">
            <div className="mr-auto text-xs text-gray-400">
              {draft.length}/{ABOUT_MAX_CHARS}
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !draft.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
