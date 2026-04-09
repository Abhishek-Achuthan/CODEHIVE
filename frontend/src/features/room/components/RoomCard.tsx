import React from 'react';
import { useNavigate } from 'react-router-dom';
import { timeAgo, parseDate } from '../../../shared/utils/dateUtils';
import type { GetPublicRoomsResponse } from '../../../shared/types/api/room';

interface RoomCardProps {
    room: GetPublicRoomsResponse;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
    const navigate = useNavigate();
    const createdAtDate = parseDate(room.createdAt);

    const handleJoin = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Navigation handler (stubbed for now as per requirements)
        navigate(`/room/${room.id}`);
    };

    return (
        <div 
            className="group relative flex flex-col h-full bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:bg-zinc-800/50 hover:border-indigo-500/30 transition-all duration-300 shadow-xl overflow-hidden"
        >
            {/* Background Glow Effect on Hover */}
            <div className="absolute -inset-px bg-linear-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex-1 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {room.title}
                    </h3>
                    <span className="shrink-0 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                        Public
                    </span>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {room.description || "No description provided."}
                </p>

                <div className="flex items-center text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-auto">
                    <span className="flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {timeAgo(createdAtDate)}
                    </span>
                </div>
            </div>

            <button
                onClick={handleJoin}
                className="relative w-full mt-6 px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg active:scale-[0.98]"
            >
                Join Room
            </button>
        </div>
    );
};
