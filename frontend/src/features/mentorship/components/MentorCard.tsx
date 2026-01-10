import React from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Star } from 'lucide-react';

interface MentorCardProps {
    mentor: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
        location?: string;
        jobTitle?: string;
        rating?: number;
    }
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
    return (
        <div className="rounded-xl border border-gray-700 bg-black px-4 py-4 hover:bg-gray-950/40 transition-colors">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-900 shrink-0">
                        {mentor.avatarUrl ? (
                            <img src={mentor.avatarUrl} alt={mentor.firstName} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-500">
                                <User className="h-6 w-6" />
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-white">
                            {mentor.firstName} {mentor.lastName}
                        </div>
                        <div className="text-xs text-gray-400">{mentor.jobTitle ?? "Mentor"}</div>

                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{mentor.location ?? "Bangalore, India"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <span className="font-medium">{mentor.rating ?? 4.5}</span>
                                <Star className="h-3 w-3 fill-current" />
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    to={`/mentors/${mentor.id}/book`}
                    state={{ mentor }}
                    className="rounded-md bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                >
                    Book
                </Link>
            </div>
        </div>
    );
};
