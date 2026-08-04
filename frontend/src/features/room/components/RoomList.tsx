import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { RoomCard } from "./RoomCard";
import { Pagination } from "../../../shared/ui/Pagination";
import { EmptyState } from "../../../shared/ui/EmptyState";
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
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
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
  emptyActionLabel,
  onEmptyAction,
  actionLabel,
  pagination,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stateRef = useRef({ hoveredIdx, expandedIdx });
  useEffect(() => {
    stateRef.current = { hoveredIdx, expandedIdx };
  }, [hoveredIdx, expandedIdx]);

  const handleMouseEnter = (idx: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const { expandedIdx: currentExpanded } = stateRef.current;
    const columns = 3;
    const compactIdx = currentExpanded !== null 
      ? (currentExpanded < columns ? currentExpanded + columns : currentExpanded - columns) 
      : null;

    if (currentExpanded !== null && (idx === currentExpanded || idx === compactIdx)) {
      setHoveredIdx(currentExpanded);
      return;
    }

    setHoveredIdx(idx);
    setExpandedIdx(null);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredIdx(null);
      setExpandedIdx(null);
    }, 150);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[280px] animate-pulse rounded-2xl border border-white/5 bg-zinc-800/50"
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
      <EmptyState
        animationSrc="https://lottie.host/f1339a20-18d2-4ccd-bb99-eddc7535ae8a/05ml6h8rIZ.json"
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
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
          {rooms.items.map((room, idx) => {
            const isHovered = hoveredIdx === idx;
            const isExpanded = expandedIdx === idx;
            
            // Only apply interaction on 3-column desktop layout
            const columns = 3;
            let compactIdx: number | null = null;
            let expandDirection: "up" | "down" | null = null;
            let compactAlign: "top" | "bottom" | null = null;

            if (expandedIdx !== null) {
              if (expandedIdx < columns) {
                // Top row expands down, shrinks card below
                expandDirection = "down";
                if (idx === expandedIdx + columns) {
                  compactIdx = idx;
                  compactAlign = "bottom";
                }
              } else {
                // Other rows expand up, shrink card above
                expandDirection = "up";
                if (idx === expandedIdx - columns) {
                  compactIdx = idx;
                  compactAlign = "top";
                }
              }
            }

            const isCompact = compactIdx === idx;

            return (
              <motion.div
                key={room.id}
                layout
                initial={listMotion.initial}
                animate={listMotion.animate}
                exit={listMotion.exit}
                transition={{ ...listMotion.transition, delay: idx * 0.04 }}
                className={`w-full lg:h-[280px] relative ${isExpanded ? 'z-50' : isHovered ? 'z-20' : 'z-10'}`}
              >
                <RoomCard 
                  room={room} 
                  actionLabel={actionLabel} 
                  isHovered={isHovered}
                  isExpanded={isExpanded}
                  isCompact={isCompact}
                  expandDirection={expandDirection}
                  compactAlign={compactAlign}
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={() => handleMouseLeave()}
                  onExpandRequest={() => setExpandedIdx(idx)}
                />
              </motion.div>
            );
          })}
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
