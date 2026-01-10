import React, { useState } from 'react';
import { MentorCard } from '../components/MentorCard';
import { Search, Loader2 } from 'lucide-react';
import { useFetchMentors } from '../hooks/useFetchMentors';

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";


const MentorListingPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const { mentors, loading, setParams, totalPages, params } = useFetchMentors({ search });


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        setParams(prev => ({ ...prev, search: val, page: 1 }));
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-2xl font-semibold text-white">Mentors</h1>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="rounded-md border border-gray-700 bg-black px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-900"
                            >
                                Rating
                            </button>
                            <button
                                type="button"
                                className="rounded-md border border-gray-700 bg-black px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-900"
                            >
                                Filter
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search here..."
                                value={search}
                                onChange={handleSearch}
                                className="w-full rounded-lg border border-gray-700 bg-black py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        </div>
                    ) : mentors.length > 0 ? (
                        <>
                            <div className="mt-10 grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {mentors.map((mentor) => (
                                    <MentorCard key={mentor.id} mentor={mentor} />
                                ))}
                            </div>

                            <div className="mt-10 flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                                    disabled={(params.page || 1) <= 1}
                                    className="rounded-md border border-gray-700 bg-black px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Prev
                                </button>
                                <span className="text-xs text-gray-400">
                                    Page {params.page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                                    disabled={(params.page || 1) >= totalPages}
                                    className="rounded-md border border-gray-700 bg-black px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="py-20 text-center text-gray-400">No mentors found.</div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MentorListingPage;
