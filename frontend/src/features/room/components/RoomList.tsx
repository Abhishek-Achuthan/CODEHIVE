import React from 'react';
import { RoomCard } from './RoomCard';
import { Pagination } from '../../../shared/ui/Pagination';
import type { GetPublicRoomsPaginatedResponse } from '../../../shared/types/api/room';

interface RoomListPagination {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
}

interface RoomListProps {
    rooms: GetPublicRoomsPaginatedResponse | null;
    isLoading: boolean;
    error: string | null;
    emptyTitle?: string;
    emptyDescription?: string;
    actionLabel?: string;
    pagination?: RoomListPagination;
}

export const RoomList: React.FC<RoomListProps> = ({
    rooms,
    isLoading,
    error,
    emptyTitle = "No public rooms available",
    emptyDescription = "Be the first to create one! Use the Create Room button to start your own space.",
    actionLabel,
    pagination,
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-zinc-800/50 rounded-2xl border border-white/5" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Failed to load rooms</h3>
                <p className="text-zinc-400">{error}</p>
            </div>
        );
    }

    if (!rooms || rooms.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-zinc-800/50 text-zinc-600 rounded-full flex items-center justify-center mb-6 border border-white/5">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{emptyTitle}</h3>
                <p className="text-zinc-500 max-w-sm">{emptyDescription}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {pagination?.totalItems !== undefined && pagination.totalItems > 0 && (
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                    Showing {rooms.items.length} of {pagination.totalItems} rooms
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {rooms.items.map((room) => (
                    <RoomCard key={room.id} room={room} actionLabel={actionLabel} />
                ))}
            </div>

            {pagination && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.onPageChange}
                    className="pt-2"
                />
            )}
        </div>
    );
};
