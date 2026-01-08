import React, { useState } from 'react';
import { MentorCard } from '../components/MentorCard';
import { Search, Loader2 } from 'lucide-react';
import { useFetchMentors } from '../hooks/useFetchMentors';


const MentorListingPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const { mentors, loading, setParams } = useFetchMentors({ search });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        setParams(prev => ({ ...prev, search: val }));
    };

    return (
        <div className="min-h-screen bg-black pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-zinc-100">Mentors</h1>

                    {/* Search */}
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder="Search mentors..."
                            value={search}
                            onChange={handleSearch}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-zinc-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                        />
                        <Search className="w-5 h-5 text-zinc-500 absolute left-3 top-3.5" />
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : mentors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentors.map((mentor) => (
                            <MentorCard key={mentor.id} mentor={mentor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-zinc-500">
                        No mentors found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorListingPage;
