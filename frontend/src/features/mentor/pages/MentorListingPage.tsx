import React, { useMemo, useState, useEffect } from 'react';
import { MentorCard } from '../components/MentorCard';
import { Search, Loader2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterChip, FilterPopover } from "../../../shared/ui/filters";
import { useFetchMentors } from '../hooks/useFetchMentors';
import { Input, Button } from "../../../shared/ui";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const PriceRangeSlider = ({ 
    initialMin, 
    initialMax, 
    onApply 
}: { 
    initialMin: number, 
    initialMax: number, 
    onApply: (min: number, max: number) => void 
}) => {
    const [minVal, setMinVal] = useState(initialMin);
    const [maxVal, setMaxVal] = useState(initialMax);

    useEffect(() => {
        setMinVal(initialMin);
        setMaxVal(initialMax);
    }, [initialMin, initialMax]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), maxVal - 5);
        setMinVal(value);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minVal + 5);
        setMaxVal(value);
    };

    const handleMouseUp = () => {
        onApply(minVal, maxVal);
    };

    const minPercent = (minVal / 1000) * 100;
    const maxPercent = (maxVal / 1000) * 100;

    return (
        <div className="flex flex-col gap-3 p-3 min-w-[220px]">
            <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Price Range</span>
                <span className="font-medium text-white">${minVal} - ${maxVal}</span>
            </div>
            
            <div className="relative w-full h-1.5 mt-2 mb-2">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-800 rounded-lg"></div>
                
                <div 
                    className="absolute top-0 bottom-0 bg-indigo-500 rounded-lg pointer-events-none"
                    style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                ></div>
                
                <input 
                    type="range"
                    min="0"
                    max="1000"
                    step="5"
                    value={minVal}
                    onChange={handleMinChange}
                    onPointerUp={handleMouseUp}
                    className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                />
                
                <input 
                    type="range"
                    min="0"
                    max="1000"
                    step="5"
                    value={maxVal}
                    onChange={handleMaxChange}
                    onPointerUp={handleMouseUp}
                    className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                />
            </div>
            
            <div className="flex justify-between text-xs text-zinc-500 mt-0.5">
                <span>$0</span>
                <span>$1000</span>
            </div>
        </div>
    );
};

const MentorListingPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [skillsInput, setSkillsInput] = useState('');
    const [visibleFilters, setVisibleFilters] = useState<Set<string>>(new Set());
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

    const hasAnyFilters = activeFilterCount > 0 || visibleFilters.size > 0;

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
        setVisibleFilters(new Set());
        setParams((prev) => ({
            ...prev,
            page: 1,
            filter: {},
        }));
    };

    const addVisibleFilter = (filter: string) => {
        setVisibleFilters(prev => new Set(prev).add(filter));
    };

    const removeVisibleFilter = (filter: string) => {
        setVisibleFilters(prev => {
            const next = new Set(prev);
            next.delete(filter);
            return next;
        });
        
        // Also clear the corresponding value in params
        if (filter === "skills") {
            setSkillsInput("");
            setParams(prev => ({ ...prev, page: 1, filter: { ...prev.filter, skillsAny: undefined } }));
        }
        if (filter === "availability") handleAvailabilityToggle(false);
    };

    return (
        <div className="flex flex-col">
            <div className="relative z-40 mb-6 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                {/* Search Bar */}
                <div className="w-full sm:w-72 md:w-80 shrink-0">
                    <Input
                        placeholder="Search by name or expertise..."
                        leftIcon={<Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300" />}
                        value={search}
                        onChange={handleSearch}
                        className="w-full border border-white/10 bg-zinc-900/50 rounded-xl shadow-sm hover:border-white/20 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all duration-200"
                    />
                </div>

                {/* Filter Chips Container */}
                <div className="flex flex-wrap items-center gap-2 max-w-full">
                    <FilterPopover trigger={(isOpen) => <FilterChip label="Expertise" value={params.filter?.primaryExpertise} isActive={isOpen || !!params.filter?.primaryExpertise} onRemove={params.filter?.primaryExpertise ? () => handleFilterChange("primaryExpertise", "") : undefined} hasDropdown />}>
                        {() => (
                            <div className="p-0.5 min-w-[200px]">
                                <input
                                    type="text"
                                    value={params.filter?.primaryExpertise || ""}
                                    onChange={(e) => handleFilterChange("primaryExpertise", e.target.value)}
                                    placeholder="e.g. Backend, UI/UX"
                                    className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                                    autoFocus
                                />
                            </div>
                        )}
                    </FilterPopover>

                    <FilterPopover trigger={(isOpen) => <FilterChip label="Experience" value={params.filter?.experienceLevel ? params.filter.experienceLevel.charAt(0).toUpperCase() + params.filter.experienceLevel.slice(1) : undefined} isActive={isOpen || !!params.filter?.experienceLevel} onRemove={params.filter?.experienceLevel ? () => handleFilterChange("experienceLevel", "") : undefined} hasDropdown />}>
                        {(close) => (
                            <div className="flex flex-col min-w-[200px] gap-0.5">
                                {[
                                    { value: "", label: "Any Level" },
                                    { value: "beginner", label: "Beginner (0-2 yrs)" },
                                    { value: "intermediate", label: "Intermediate (2-5 yrs)" },
                                    { value: "advanced", label: "Advanced (5-10 yrs)" },
                                    { value: "expert", label: "Expert (10+ yrs)" },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { handleFilterChange("experienceLevel", opt.value); close(); }}
                                        className={`px-3 py-2 text-left text-sm rounded-lg transition-colors ${params.filter?.experienceLevel === opt.value || (!params.filter?.experienceLevel && opt.value === "") ? "bg-indigo-500/10 text-indigo-300" : "text-zinc-300 hover:bg-zinc-800 hover:text-white"}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </FilterPopover>

                    <FilterPopover 
                        alignClass="right-0 sm:left-0 sm:right-auto" 
                        trigger={(isOpen) => (
                            <FilterChip 
                                label="Price" 
                                value={
                                    params.filter?.slotPriceMin !== undefined || params.filter?.slotPriceMax !== undefined
                                        ? `$${params.filter?.slotPriceMin ?? 0} - $${params.filter?.slotPriceMax ?? 1000}`
                                        : undefined
                                } 
                                isActive={isOpen || params.filter?.slotPriceMin !== undefined || params.filter?.slotPriceMax !== undefined} 
                                onRemove={(params.filter?.slotPriceMin !== undefined || params.filter?.slotPriceMax !== undefined) 
                                    ? () => { handleFilterChange("slotPriceMin", ""); handleFilterChange("slotPriceMax", ""); } 
                                    : undefined
                                } 
                                hasDropdown 
                            />
                        )}
                    >
                        {() => (
                            <PriceRangeSlider 
                                initialMin={params.filter?.slotPriceMin ?? 0}
                                initialMax={params.filter?.slotPriceMax ?? 1000}
                                onApply={(min, max) => {
                                    if (min === 0 && max === 1000) {
                                        handleFilterChange("slotPriceMin", "");
                                        handleFilterChange("slotPriceMax", "");
                                    } else {
                                        handleFilterChange("slotPriceMin", min.toString());
                                        handleFilterChange("slotPriceMax", max.toString());
                                    }
                                }}
                            />
                        )}
                    </FilterPopover>

                    {(() => {
                        const hasUnaddedSkills = !visibleFilters.has("skills") && (!params.filter?.skillsAny || params.filter.skillsAny.length === 0);
                        const hasUnaddedAvailability = !visibleFilters.has("availability") && !params.filter?.hasActiveAvailability;
                        
                        if (hasUnaddedSkills || hasUnaddedAvailability) {
                            return (
                                <FilterPopover
                                    alignClass="left-0 sm:right-0 sm:left-auto"
                                    trigger={(isOpen) => (
                                        <button className={`flex items-center gap-1.5 shrink-0 rounded-xl border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors h-[34px]
                                            ${isOpen ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300" : "border-white/10 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"}
                                        `}>
                                            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            <span>More Filters</span>
                                        </button>
                                    )}
                                >
                                    {(close) => (
                                        <div className="flex flex-col min-w-[180px] gap-0.5">
                                            {hasUnaddedSkills && (
                                                <button onClick={() => { addVisibleFilter("skills"); close(); }} className="px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                                                    Skills
                                                </button>
                                            )}
                                            {hasUnaddedAvailability && (
                                                <button onClick={() => { addVisibleFilter("availability"); handleAvailabilityToggle(true); close(); }} className="px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                                                    Available Now
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </FilterPopover>
                            );
                        }
                        return null;
                    })()}
                </div>
                </div>

                <AnimatePresence>
                    {hasAnyFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                            animate={{ opacity: 1, height: "auto", transitionEnd: { overflow: "visible" } }}
                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                            className="flex flex-wrap items-center gap-2 mt-4 pb-2"
                        >
                            <AnimatePresence mode="popLayout">
                                {(visibleFilters.has("skills") || (params.filter?.skillsAny && params.filter.skillsAny.length > 0)) && (
                                    <motion.div
                                        key="skills"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <FilterPopover trigger={(isOpen) => <FilterChip label="Skills" value={params.filter?.skillsAny?.join(", ")} isActive={isOpen || (!!params.filter?.skillsAny && params.filter.skillsAny.length > 0)} onRemove={() => removeVisibleFilter("skills")} hasDropdown />}>
                                            {(close) => (
                                                <div className="p-2 min-w-[220px]">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={skillsInput}
                                                            onChange={(e) => setSkillsInput(e.target.value)}
                                                            placeholder="React, TypeScript"
                                                            className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                                                            onKeyDown={(e) => { if (e.key === "Enter") { handleSkillsApply(); close(); } }}
                                                            autoFocus
                                                        />
                                                        <button onClick={() => { handleSkillsApply(); close(); }} className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors">Apply</button>
                                                    </div>
                                                </div>
                                            )}
                                        </FilterPopover>
                                    </motion.div>
                                )}

                                {(visibleFilters.has("availability") || params.filter?.hasActiveAvailability) && (
                                    <motion.div
                                        key="availability"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onClick={() => handleAvailabilityToggle(!params.filter?.hasActiveAvailability)}
                                    >
                                        <FilterChip label="Available Now" isActive={params.filter?.hasActiveAvailability} onRemove={() => removeVisibleFilter("availability")} />
                                    </motion.div>
                                )}

                                <motion.button
                                    key="clear-all"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={handleResetFilters}
                                    className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                                >
                                    Clear All
                                </motion.button>
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex min-h-[400px] items-center justify-center"
                    >
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                    </motion.div>
                ) : error ? (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-800 text-sm text-zinc-500"
                    >
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={retry}
                            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                        >
                            Retry
                        </button>
                    </motion.div>
                ) : mentors.length > 0 ? (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {mentors.map((mentor) => (
                            <MentorCard key={mentor.id} mentor={mentor} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex flex-col items-center justify-center pt-4 pb-24 text-center min-h-[50vh]"
                    >
                        <div className="w-[300px] h-[300px] mb-8 mt-[10px]">
                            <DotLottieReact
                                src="https://lottie.host/d34c0c51-eac1-47d3-9b9f-7bd756690f52/bJspymEknm.json"
                                loop
                                autoplay
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                        
                        <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                            No mentors found
                        </h3>
                        
                        <p className="text-zinc-400 max-w-sm mx-auto mb-10 text-base leading-relaxed">
                            We couldn't find any mentors matching your criteria. Try adjusting your filters.
                        </p>
                        
                        <Button 
                            variant="primary" 
                            onClick={handleResetFilters}
                            className="h-12 px-10 font-semibold rounded-xl text-base"
                        >
                            Clear Filters
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. Pagination - Centered at Bottom */}
            {!loading && mentors.length > 0 && (
                <div className="mt-6 flex justify-center pb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                            disabled={(params.page || 1) <= 1}
                            className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Prev
                        </button>
                        <span className="text-xs text-zinc-500 tabular-nums">
                            Page <span className="text-zinc-200">{params.page}</span> of {totalPages}
                        </span>
                        <button
                            onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                            disabled={(params.page || 1) >= totalPages}
                            className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
