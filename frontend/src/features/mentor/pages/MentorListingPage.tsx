import React, { useMemo, useState } from 'react';
import { MentorCard } from '../components/MentorCard';
import { Search, Loader2, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetchMentors } from '../hooks/useFetchMentors';
import { PageHeader } from '../../../shared/ui/PageHeader';

const MentorListingPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [skillsInput, setSkillsInput] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const { mentors, loading, error, setParams, totalPages, params, retry } = useFetchMentors({ search });

    const activeFilterCount = useMemo(() => {
        let count = 0;

        if (params.filter?.primaryExpertise) count += 1;
        if (params.filter?.experienceLevel) count += 1;
        if (params.filter?.skillsAny && params.filter.skillsAny.length > 0) count += 1;
        if (params.filter?.slotPriceMin !== undefined || params.filter?.slotPriceMax !== undefined) count += 1;
        if (params.filter?.hasActiveAvailability) count += 1;

        return count;
    }, [params.filter]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        setParams(prev => ({ ...prev, search: val, page: 1 }));
    };

    const handleFilterChange = (
        key: "primaryExpertise" | "experienceLevel" | "slotPriceMin" | "slotPriceMax",
        value: string
    ) => {
        setParams((prev) => ({
            ...prev,
            page: 1,
            filter: {
                ...prev.filter,
                [key]:
                    key === "slotPriceMin" || key === "slotPriceMax"
                        ? value === ""
                            ? undefined
                            : Number(value)
                        : value || undefined,
            },
        }));
    };

    const handleSkillsApply = () => {
        const skills = skillsInput
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0);

        setParams((prev) => ({
            ...prev,
            page: 1,
            filter: {
                ...prev.filter,
                skillsAny: skills.length > 0 ? skills : undefined,
            },
        }));
    };

    const handleAvailabilityToggle = (checked: boolean) => {
        setParams((prev) => ({
            ...prev,
            page: 1,
            filter: {
                ...prev.filter,
                hasActiveAvailability: checked ? true : undefined,
            },
        }));
    };

    const handleResetFilters = () => {
        setSkillsInput("");
        setParams((prev) => ({
            ...prev,
            page: 1,
            filter: {},
        }));
    };

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Discover Sessions"
                description="Find and book mentorship sessions with industry experts"
            >

            </PageHeader>

            <div className="relative z-40 mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="group relative w-full flex-1 sm:max-w-md">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-xl transition-colors group-focus-within:bg-indigo-500/10" />
                    <input
                        type="text"
                        placeholder="Search by name or expertise..."
                        value={search}
                        onChange={handleSearch}
                        className="relative w-full rounded-xl border border-white/5 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white backdrop-blur-md transition-all placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-indigo-400" />
                </div>
                
                <div className="relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex h-full w-full sm:w-auto items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold backdrop-blur-md transition-all ${
                            showFilters || activeFilterCount > 0
                                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                                : "border-white/5 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.05]"
                        }`}
                    >
                        <Filter className="h-4 w-4" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showFilters && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                    onClick={() => setShowFilters(false)}
                                />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
                                >
                                    <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-5">
                                        <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                                            <Filter className="h-5 w-5 text-indigo-400" />
                                            Advanced Filters
                                        </h3>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                                        <div className="flex flex-col gap-6">
                                            <div className="space-y-2.5">
                                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                                    Primary Expertise
                                                </label>
                                                <input
                                                    type="text"
                                                    value={params.filter?.primaryExpertise ?? ""}
                                                    onChange={(e) => handleFilterChange("primaryExpertise", e.target.value)}
                                                    placeholder="e.g. Backend"
                                                    className="w-full rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                            </div>

                                            <div className="space-y-2.5">
                                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                                    Experience Level
                                                </label>
                                                <select
                                                    value={params.filter?.experienceLevel ?? ""}
                                                    onChange={(e) => handleFilterChange("experienceLevel", e.target.value)}
                                                    className="w-full rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                >
                                                    <option value="">Any Level</option>
                                                    <option value="beginner">Beginner (0-2 yrs)</option>
                                                    <option value="intermediate">Intermediate (2-5 yrs)</option>
                                                    <option value="advanced">Advanced (5-10 yrs)</option>
                                                    <option value="expert">Expert (10+ yrs)</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2.5">
                                                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                                    Skills
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={skillsInput}
                                                        onChange={(e) => setSkillsInput(e.target.value)}
                                                        placeholder="React, TypeScript"
                                                        className="w-full rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleSkillsApply}
                                                        className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-3 text-xs font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/20"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2.5">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                                        Min Price
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={params.filter?.slotPriceMin ?? ""}
                                                        onChange={(e) => handleFilterChange("slotPriceMin", e.target.value)}
                                                        placeholder="0"
                                                        className="w-full rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    />
                                                </div>
                                                <div className="space-y-2.5">
                                                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                                        Max Price
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={params.filter?.slotPriceMax ?? ""}
                                                        onChange={(e) => handleFilterChange("slotPriceMax", e.target.value)}
                                                        placeholder="Any"
                                                        className="w-full rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <label className="group flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-4 transition-colors hover:bg-zinc-800/50">
                                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Active availability only</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={params.filter?.hasActiveAvailability === true}
                                                        onChange={(e) => handleAvailabilityToggle(e.target.checked)}
                                                        className="h-5 w-5 rounded border-white/10 bg-zinc-950 text-indigo-500 transition-colors focus:ring-indigo-500/20 focus:ring-offset-0 focus:ring-offset-transparent"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-6 py-5">
                                        <button
                                            onClick={handleResetFilters}
                                            disabled={activeFilterCount === 0 && !skillsInput}
                                            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-50"
                                        >
                                            Clear All
                                        </button>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-colors hover:bg-indigo-600"
                                        >
                                            Show Results
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {loading ? (
                <div className="flex min-h-[400px] items-center justify-center bg-white/[0.01] rounded-3xl border border-white/5">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                </div>
            ) : error ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-800 text-sm text-gray-500">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={retry}
                        className="rounded-md border border-gray-700 bg-black px-4 py-2 text-xs font-semibold text-gray-200 transition-colors hover:bg-gray-900"
                    >
                        Retry
                    </button>
                </div>
            ) : mentors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mentors.map((mentor) => (
                        <MentorCard key={mentor.id} mentor={mentor} />
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[300px] items-center justify-center text-sm text-gray-500 border border-dashed border-gray-800 rounded-xl">
                    No mentors found matching your criteria.
                </div>
            )}

            {/* 4. Pagination - Centered at Bottom */}
            {!loading && mentors.length > 0 && (
                <div className="mt-8 flex justify-center pb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                            disabled={(params.page || 1) <= 1}
                            className="rounded-md border border-gray-700 bg-black px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Prev
                        </button>
                        <span className="text-xs text-gray-500 tabular-nums">
                            Page <span className="text-gray-200">{params.page}</span> of {totalPages}
                        </span>
                        <button
                            onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                            disabled={(params.page || 1) >= totalPages}
                            className="rounded-md border border-gray-700 bg-black px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorListingPage;
