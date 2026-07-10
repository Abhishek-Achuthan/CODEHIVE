import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Lock, Globe, Clock, ArrowRight } from 'lucide-react';
import { timeAgo, parseDate } from '../../../shared/utils/dateUtils';
import type { GetPublicRoomsResponse } from '../../../shared/types/api/room';

interface RoomCardProps {
    room: GetPublicRoomsResponse;
    actionLabel?: string;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, actionLabel = "Join Room" }) => {
    const navigate = useNavigate();
    const createdAtDate = parseDate(room.createdAt);
    const isPrivate = room.visibility === "PRIVATE";

    const handleJoin = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/room/${room.id}`);
    };

    return (
        <div 
            onClick={handleJoin}
            className="group relative flex flex-col h-full bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 hover:bg-zinc-800/60 hover:border-indigo-500/40 transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer"
        >
            {/* Background Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex-1 flex flex-col gap-5">
                {/* Header: Title and Visibility Badge */}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight capitalize">
                        {room.title}
                    </h3>
                    <div
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border backdrop-blur-md ${
                        isPrivate
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      }`}
                    >
                        {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        {isPrivate ? "Private" : "Public"}
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 flex-1 min-h-[4.5rem]">
                    {room.description || "No description provided for this room."}
                </p>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-400 mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span className="text-zinc-300">
                            <span className="text-white font-bold">{room.participantCount}</span>
                            <span className="opacity-60"> / {room.maxParticipants}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span className="text-zinc-300 capitalize">{timeAgo(createdAtDate)}</span>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-6">
                <button
                    className="relative w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-indigo-600/90 hover:bg-indigo-500 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:shadow-[0_0_25px_rgba(79,70,229,0.3)] active:scale-[0.98] group-hover:bg-indigo-500"
                >
                    {actionLabel}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
};
