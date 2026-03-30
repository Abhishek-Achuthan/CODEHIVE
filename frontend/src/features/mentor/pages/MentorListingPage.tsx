import React, { useState } from 'react';
import { MentorCard } from '../components/MentorCard';
import { Search, Loader2 } from 'lucide-react';
import { useFetchMentors } from '../hooks/useFetchMentors';
import { PageHeader } from '../../../shared/ui/PageHeader';

const MentorListingPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const { mentors, loading, error, setParams, totalPages, params, retry } = useFetchMentors({ search });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        setParams(prev => ({ ...prev, search: val, page: 1 }));
    };

    return (
        <div className="flex flex-col">
            {/* 1. Header + Actions */}
            <PageHeader
                title="Discover Sessions"
                description="Find and book mentorship sessions with industry experts"
            >
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded-md border border-gray-700 bg-black px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-900 transition-colors"
                    >
                        Rating
                    </button>
                    <button
                        type="button"
                        className="rounded-md border border-gray-700 bg-black px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-900 transition-colors"
                    >
                        Filter
                    </button>
                </div>
            </PageHeader>

            {/* 2. Search Bar - Elevated Subsurface */}
            <div className="mb-10 flex">
                <div className="relative w-full max-w-md group">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or expertise..."
                        value={search}
                        onChange={handleSearch}
                        className="relative w-full rounded-xl border border-white/5 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all backdrop-blur-md"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                </div>
            </div>

            {/* 3. Content Area / List */}
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
