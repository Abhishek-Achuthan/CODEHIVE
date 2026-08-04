import { useEffect, useState } from "react";
import { Pencil, Sparkles, TrendingUp, X } from "lucide-react";
import SectionCard from "./SectionCard";

const EXPERIENCE_LEVELS = [
    { value: "beginner", label: "Beginner", desc: "0-2 yrs" },
    { value: "intermediate", label: "Intermediate", desc: "2-5 yrs" },
    { value: "advanced", label: "Advanced", desc: "5-10 yrs" },
    { value: "expert", label: "Expert", desc: "10+ yrs" },
];

export interface ExpertiseSectionProps {
    initialPrimaryExpertise?: string;
    initialExperienceLevel?: string;
    onSave?: (data: { primaryExpertise?: string; experienceLevel?: string }) => Promise<void>;
    readonly?: boolean;
}

export default function ExpertiseSection({
    initialPrimaryExpertise,
    initialExperienceLevel,
    onSave,
    readonly = false,
}: ExpertiseSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [primaryExpertise, setPrimaryExpertise] = useState(initialPrimaryExpertise || "");
    const [experienceLevel, setExperienceLevel] = useState(initialExperienceLevel || "");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isEditing) {
            setPrimaryExpertise(initialPrimaryExpertise || "");
            setExperienceLevel(initialExperienceLevel || "");
        }
    }, [initialPrimaryExpertise, initialExperienceLevel, isEditing]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await onSave?.({ primaryExpertise: primaryExpertise.trim(), experienceLevel });
            setIsEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setPrimaryExpertise(initialPrimaryExpertise || "");
        setExperienceLevel(initialExperienceLevel || "");
        setIsEditing(false);
    };

    const currentLevel = EXPERIENCE_LEVELS.find((l) => l.value === experienceLevel);

    return (
        <SectionCard
            title="Expertise"
            rightAction={
                !readonly && (
                    <button
                        onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                    >
                        {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                    </button>
                )
            }
        >
            {!isEditing || readonly ? (
                /* Display Mode */
                !primaryExpertise && !experienceLevel ? (
                    <div className="rounded-xl border border-dashed border-zinc-800 bg-[#09090b]/50 px-6 py-8 text-center">
                        <div className="text-sm font-medium text-zinc-400">
                            Add your primary expertise and experience level
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4">
                        {primaryExpertise && (
                            <div className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-2">
                                <Sparkles className="h-4 w-4 text-indigo-400" />
                                <span className="text-[13px] font-medium text-indigo-100">{primaryExpertise}</span>
                            </div>
                        )}
                        {currentLevel && (
                            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                                <TrendingUp className="h-4 w-4 text-emerald-400" />
                                <span className="text-[13px] font-medium text-emerald-100">{currentLevel.label}</span>
                                <span className="text-[11px] font-medium text-emerald-500/80">({currentLevel.desc})</span>
                            </div>
                        )}
                    </div>
                )
            ) : (
                /* Edit Mode */
                <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Primary Expertise - Simple text input */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Primary Expertise
                            </label>
                            <input
                                type="text"
                                value={primaryExpertise}
                                onChange={(e) => setPrimaryExpertise(e.target.value)}
                                placeholder="e.g. Frontend Development"
                                className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
                            />
                        </div>

                        {/* Experience Level */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Experience Level
                            </label>
                            <select
                                value={experienceLevel}
                                onChange={(e) => setExperienceLevel(e.target.value)}
                                className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors appearance-none"
                            >
                                <option value="" className="text-zinc-500">Select level</option>
                                {EXPERIENCE_LEVELS.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label} ({level.desc})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
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
