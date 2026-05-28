import { AnimatePresence, motion } from "framer-motion";
import { RoomCard } from "./RoomCard";
import { Pagination } from "../../../shared/ui/Pagination";
import type { GetPublicRoomsPaginatedResponse } from "../../../shared/types/api/room";

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

const listMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18 },
};

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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-2xl border border-white/5 bg-zinc-800/50"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">Failed to load rooms</h3>
        <p className="text-zinc-400">{error}</p>
      </motion.div>
    );
  }

  if (!rooms || rooms.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/40 py-20 text-center backdrop-blur-xl"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/5 bg-zinc-800/50 text-zinc-600">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-white">{emptyTitle}</h3>
        <p className="max-w-sm text-zinc-500">{emptyDescription}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {pagination?.totalItems !== undefined && pagination.totalItems > 0 && (
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Showing {rooms.items.length} of {pagination.totalItems} rooms
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {rooms.items.map((room, idx) => (
            <motion.div
              key={room.id}
              layout
              initial={listMotion.initial}
              animate={listMotion.animate}
              exit={listMotion.exit}
              transition={{ ...listMotion.transition, delay: idx * 0.04 }}
            >
              <RoomCard room={room} actionLabel={actionLabel} />
            </motion.div>
          ))}
        </AnimatePresence>
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
