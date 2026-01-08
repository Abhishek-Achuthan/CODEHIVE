import React from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Star } from 'lucide-react';

interface MentorCardProps {
    mentor: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
        // location: string;
        jobTitle?: string; 
        rating?: number;   
    }
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                            {mentor.avatarUrl ? (
                                <img src={mentor.avatarUrl} alt={mentor.firstName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg text-zinc-100 group-hover:text-blue-400 transition-colors">
                                {mentor.firstName} {mentor.lastName}
                            </h3>
                            <p className="text-sm text-zinc-400">Mentor</p>

                            <div className="flex items-center text-xs text-zinc-500 gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>Bangalore, India</span> 
                            </div>

                            <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                                <span className="font-medium">4.5</span>
                                <Star className="w-3 h-3 fill-current" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <Link
                        to={`/mentors/${mentor.id}/book`}
                        state={{ mentor }}
                        className="block w-full py-2.5 text-center text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-600"
                    >
                        Book Session
                    </Link>
                </div>
            </div>
        </div>
    );
};
