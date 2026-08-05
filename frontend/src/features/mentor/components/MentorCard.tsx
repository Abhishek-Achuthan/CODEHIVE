import React from 'react';
import { Link } from 'react-router-dom';
import { User, Star, Sparkles, TrendingUp } from 'lucide-react';
import type { MentorCardData } from '../../../shared/types/api/mentor';

interface MentorCardProps {
    mentor: MentorCardData;
}

const LEVEL_LABELS: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    expert: "Expert",
};

export const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
    const levelLabel = mentor.experienceLevel ? LEVEL_LABELS[mentor.experienceLevel] || mentor.experienceLevel : null;

    return (
        <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5 transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 overflow-hidden">
            {/* Background Decorative Gradient */}
            <div className="absolute -right-10 -top-10 h-32 w-32 bg-indigo-500/5 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 sm:gap-4">
                    {/* Avatar with Ring */}
                    <div className="relative shrink-0">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all duration-500">
                            {mentor.avatarUrl ? (
                                <img src={mentor.avatarUrl} alt={mentor.firstName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-zinc-600">
                                    <User className="h-7 w-7 sm:h-8 sm:w-8" />
                                </div>
                            )}
                        </div>
                        {/* Rating Badge */}
                        <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1 rounded-lg bg-zinc-900 px-1.5 py-0.5 text-[10px] font-bold text-yellow-500 border border-white/5 shadow-lg ring-1 ring-black/50">
                            <span>{mentor.rating ?? 4.5}</span>
                            <Star className="h-2.5 w-2.5 fill-current" />
                        </div>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors duration-300 truncate">
                            {mentor.firstName} {mentor.lastName}
                        </h3>

                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                            {mentor.primaryExpertise && (
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-500/20">
                                    <Sparkles className="h-3 w-3" />
                                    <span>{mentor.primaryExpertise}</span>
                                </div>
                            )}
                            {levelLabel && (
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{levelLabel}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Buttons Container: Side-by-side on mobile, stacked on sm+ screens */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 sm:border-0 sm:pt-0 sm:flex sm:flex-col sm:shrink-0 sm:min-w-[110px]">
                    <Link
                        to={`/mentors/${mentor.id}`}
                        className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4 sm:px-5 py-2 text-xs font-bold text-white transition-all duration-300 hover:bg-white/10 hover:shadow-lg active:scale-95 text-center flex items-center justify-center"
                    >
                        View Profile
                    </Link>
                    <Link
                        to={`/mentors/${mentor.id}/book`}
                        state={{ mentor }}
                        className="relative shrink-0 overflow-hidden rounded-xl bg-white px-4 sm:px-5 py-2 text-xs font-bold text-black transition-all duration-300 hover:bg-indigo-500 hover:text-white hover:shadow-lg active:scale-95 text-center flex items-center justify-center"
                    >
                        Book
                    </Link>
                </div>
            </div>
        </div>
    );
};
