import { useEffect, useState } from "react";
import { Globe, Pencil, Plus, X } from "lucide-react";
import SectionCard from "./SectionCard";
import type { UserLanguage } from "../../../shared/types/domain/language.types";
import { UserRole } from "../../../shared/constants/auth";

export interface LanguagesSectionProps {
  initialLanguages: UserLanguage[];
  onSave?: (languages: UserLanguage[]) => Promise<void>;
  readonly?: boolean;
  role?: UserRole;
}

const PROFICIENCY_LEVELS = ["Native", "Fluent", "Professional", "Intermediate", "Basic"] as const;

export default function LanguagesSection({
  initialLanguages,
  onSave,
  readonly = false,
  role
}: LanguagesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [languages, setLanguages] = useState<UserLanguage[]>(initialLanguages);
  const [inputLanguage, setInputLanguage] = useState("");
  const [inputProficiency, setInputProficiency] = useState<UserLanguage["proficiency"]>("Native");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setLanguages(initialLanguages);
    }
  }, [initialLanguages, isEditing]);

  const addLanguage = () => {
    const rawLang = inputLanguage.replace(/\s+/g, " ").trim();
    if (!rawLang) return;

    const exists = languages.some(
      (l) => l.language.toLowerCase() === rawLang.toLowerCase()
    );
    if (exists) {
      setInputLanguage("");
      return;
    }

    const newLangs = [...languages, { language: rawLang, proficiency: inputProficiency }];
    newLangs.sort((a, b) => a.language.localeCompare(b.language));

    setLanguages(newLangs);
    setInputLanguage("");
    setInputProficiency("Native");
  };

  const removeLanguage = (languageName: string) => {
    setLanguages((prev) => prev.filter((l) => l.language !== languageName));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave?.(languages);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLanguages(initialLanguages);
    setInputLanguage("");
    setInputProficiency("Native");
    setIsEditing(false);
  };

  const canAdd = Boolean(inputLanguage.replace(/\s+/g, " ").trim());

  return (
    <SectionCard
      title="Languages"
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
      <div className="flex flex-col gap-3">
        {languages.length === 0 ? (
          <div className="w-full rounded-xl border border-dashed border-zinc-800 bg-[#09090b]/50 px-6 py-8 text-center">
            <div className="text-sm font-medium text-zinc-400">
              No languages added yet
            </div>
            {role === UserRole.MENTOR && (
               <div className="mt-2 text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                 Add spoken languages to help mentees find you.
               </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {languages.map((l) => (
              <div
                key={l.language}
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-3 text-[14px] font-medium text-zinc-200">
                  <Globe className="h-4 w-4 text-zinc-500" />
                  <span>{l.language}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-md bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                    {l.proficiency}
                  </span>
                  {isEditing && !readonly && (
                    <button
                      type="button"
                      onClick={() => removeLanguage(l.language)}
                      className="text-zinc-500 hover:text-zinc-200 transition-colors ml-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              value={inputLanguage}
              onChange={(e) => setInputLanguage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLanguage();
                }
              }}
              placeholder="e.g. English"
              maxLength={40}
              className="h-10 w-full sm:flex-1 rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
            
            <select
              value={inputProficiency}
              onChange={(e) => setInputProficiency(e.target.value as UserLanguage["proficiency"])}
              className="h-10 w-full sm:w-auto min-w-[140px] rounded-lg border border-zinc-800 bg-[#09090b] px-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors cursor-pointer appearance-none"
            >
              {PROFICIENCY_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <button
              onClick={addLanguage}
              disabled={!canAdd}
              className="w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-800 px-4 text-sm font-medium text-zinc-100 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>

          <div className="flex items-center gap-3 self-end mt-2">
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
