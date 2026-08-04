import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Lock, Globe, Clock, ArrowRight } from 'lucide-react';
import { timeAgo, parseDate } from '../../../shared/utils/dateUtils';
import type { GetPublicRoomsResponse } from '../../../shared/types/api/room';

interface RoomCardProps {
    room: GetPublicRoomsResponse;
    actionLabel?: string;
    isHovered?: boolean;
    isExpanded?: boolean;
    isCompact?: boolean;
    expandDirection?: 'up' | 'down' | null;
    compactAlign?: 'top' | 'bottom' | null;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onExpandRequest?: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ 
    room, 
    actionLabel = "Join Room",
    isHovered = false,
    isExpanded = false,
    isCompact = false,
    expandDirection = null,
    compactAlign = null,
    onMouseEnter,
    onMouseLeave,
    onExpandRequest
}) => {
    const navigate = useNavigate();
    const createdAtDate = parseDate(room.createdAt);
    const isPrivate = room.visibility === "PRIVATE";

    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (isHovered && !isExpanded) {
            let isOverflow = false;
            if (titleRef.current) {
                isOverflow = isOverflow || titleRef.current.scrollHeight > titleRef.current.clientHeight + 2;
                isOverflow = isOverflow || titleRef.current.scrollWidth > titleRef.current.clientWidth + 2;
            }
            if (descRef.current) {
                isOverflow = isOverflow || descRef.current.scrollHeight > descRef.current.clientHeight + 2;
                isOverflow = isOverflow || descRef.current.scrollWidth > descRef.current.clientWidth + 2;
            }
            if (isOverflow && onExpandRequest) {
                onExpandRequest();
            }
        }
    }, [isHovered, isExpanded, onExpandRequest]);

    const handleJoin = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/room/${room.id}`);
    };

    const baseClasses = "group flex flex-col bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 transition-all duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl overflow-hidden cursor-pointer";
    let dynamicClasses = "relative h-full w-full lg:z-0";

    if (isExpanded) {
        dynamicClasses = expandDirection === 'up' 
            ? "relative h-full lg:absolute lg:bottom-0 lg:top-auto lg:w-full lg:h-auto lg:min-h-[280px] lg:z-10 bg-zinc-800/60 border-indigo-500/40" 
            : "relative h-full lg:absolute lg:top-0 lg:bottom-auto lg:w-full lg:h-auto lg:min-h-[280px] lg:z-10 bg-zinc-800/60 border-indigo-500/40";
    } else if (isCompact) {
        dynamicClasses = compactAlign === 'top'
            ? "relative h-full lg:absolute lg:top-0 lg:bottom-auto lg:w-full lg:h-[160px] lg:z-0"
            : "relative h-full lg:absolute lg:bottom-0 lg:top-auto lg:w-full lg:h-[160px] lg:z-0";
    } else if (isHovered) {
        dynamicClasses += " lg:scale-[1.02] bg-zinc-800/60 border-indigo-500/40 shadow-indigo-500/10";
    } else {
        dynamicClasses += " hover:bg-zinc-800/60 hover:border-indigo-500/40";
    }

    const hostNameDisplay = room.hostName || `Developer ${room.hostId.slice(-4)}`;

    return (
        <div 
            onClick={handleJoin} 
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`${baseClasses} ${dynamicClasses}`}
        >
            {/* Background Glow Effect on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/5 to-purple-500/10 transition-opacity duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

            {/* Header: Title and Visibility Badge */}
            <div className="relative flex items-start justify-between gap-4 z-10">
                <h3 
                    ref={titleRef}
                    className={`text-xl font-bold text-white transition-colors leading-tight capitalize ${isHovered ? 'text-indigo-400' : ''} ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}`}
                >
                    {room.title}
                </h3>
                <div
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border backdrop-blur-md transition-opacity duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        isCompact ? "lg:opacity-0" : "opacity-100"
                    } ${
                        isPrivate
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    }`}
                >
                    {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {isPrivate ? "Private" : "Public"}
                </div>
            </div>

            <div className="relative flex-1 mt-4 z-10 flex flex-col h-full">

                {/* Content wrapper: fades out in compact mode */}
                <div className={`flex flex-col transition-all duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${isCompact ? 'lg:opacity-0 lg:h-0 lg:overflow-hidden' : 'opacity-100'}`}>
                    {/* Description */}
                    <p 
                        ref={descRef}
                        className={`text-sm text-zinc-400 leading-relaxed transition-all duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] mb-3 ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}`}
                    >
                        {room.description || "No description provided for this room."}
                    </p>

                    {/* Host Info */}
                    <div className="flex items-center gap-2 text-xs mb-3">
                        <span className="text-zinc-500 w-16">Host:</span>
                        <span className="text-zinc-300 font-medium truncate">{hostNameDisplay}</span>
                    </div>
                </div>

                    {/* Metadata row */}
                    <div className={`flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-400 pt-3 border-t border-white/5 ${isCompact ? 'mt-auto' : ''}`}>
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

                    {/* Action Button */}
                    <div className={`transition-all duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${isCompact ? 'lg:opacity-0 lg:h-0 lg:mt-0 lg:overflow-hidden' : 'mt-auto pt-4 opacity-100'}`}>
                        <button
                            className={`relative w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-indigo-600/90 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.15)] active:scale-[0.98] ${isHovered ? 'bg-indigo-500 shadow-[0_0_25px_rgba(79,70,229,0.3)]' : 'hover:bg-indigo-500'}`}
                        >
                            {actionLabel}
                            <ArrowRight className={`w-4 h-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                        </button>
                    </div>
            </div>
        </div>
    );
};
