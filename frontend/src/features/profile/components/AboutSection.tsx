import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import SectionCard from "./SectionCard";

const ABOUT_MAX_CHARS = 200;

export interface AboutSectionProps {
  initialText: string;
  onSave?: (text: string) => Promise<void>;
  readonly?: boolean;
}

export default function AboutSection({
  initialText,
  onSave,
  readonly = false,
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
      await onSave?.(normalized);
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
      title="About"
      rightAction={
        !readonly && (
          !isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
              aria-label="Edit about"
            >
              <Pencil className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          )
        )
      }
    >
      {!isEditing || readonly ? (
        <p className={`text-sm leading-relaxed ${initialText ? 'text-zinc-300' : 'text-zinc-500 italic'}`}>
          {initialText || "No description provided."}
        </p>
      ) : (
        <div className="grid gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={ABOUT_MAX_CHARS}
            className="min-h-[120px] w-full resize-none rounded-lg border border-zinc-800 bg-[#09090b] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            placeholder="Write a brief introduction about yourself..."
          />

          <div className="flex items-center justify-end gap-3 mt-1">
            <div className="mr-auto text-xs text-zinc-500">
              {draft.length}/{ABOUT_MAX_CHARS}
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !draft.trim()}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
