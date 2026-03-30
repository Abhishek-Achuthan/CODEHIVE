import { useEffect, useState } from "react";
import { Pencil, Sparkles, TrendingUp } from "lucide-react";
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
                        className="inline-flex items-center justify-center rounded-md border border-gray-700 p-2 text-gray-200 hover:bg-gray-900"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                )
            }
        >
            {!isEditing || readonly ? (
                /* Display Mode */
                !primaryExpertise && !experienceLevel ? (
                    <div className="rounded-lg border border-dashed border-gray-700 bg-gray-950/30 px-4 py-3">
                        <div className="text-sm text-gray-400">
                            Add your primary expertise and experience level
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {primaryExpertise && (
                            <div className="inline-flex items-center gap-2 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                                <span className="text-sm font-medium text-white">{primaryExpertise}</span>
                            </div>
                        )}
                        {currentLevel && (
                            <div className="inline-flex items-center gap-2 rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1.5">
                                <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                                <span className="text-sm font-medium text-white">{currentLevel.label}</span>
                                <span className="text-xs text-gray-400">({currentLevel.desc})</span>
                            </div>
                        )}
                    </div>
                )
            ) : (
                /* Edit Mode */
                <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {/* Primary Expertise - Simple text input */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-400">
                                Primary Expertise
                            </label>
                            <input
                                type="text"
                                value={primaryExpertise}
                                onChange={(e) => setPrimaryExpertise(e.target.value)}
                                placeholder="e.g. React, Node.js, Machine Learning"
                                className="h-9 w-full rounded-md border border-gray-700 bg-black px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Experience Level */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-400">
                                Experience Level
                            </label>
                            <select
                                value={experienceLevel}
                                onChange={(e) => setExperienceLevel(e.target.value)}
                                className="h-9 w-full rounded-md border border-gray-700 bg-black px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">Select level</option>
                                {EXPERIENCE_LEVELS.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label} ({level.desc})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleCancel}
                            className="h-8 rounded-md border border-gray-700 px-3 text-xs text-gray-300 hover:bg-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="h-8 rounded-md bg-blue-600 px-4 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </SectionCard>
    );
}
