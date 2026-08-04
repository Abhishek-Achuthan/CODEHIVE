import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import type { PaginationProps } from '../types/core/shared'

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 rounded-full hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors flex items-center justify-center text-zinc-400 hover:text-white"
        aria-label="Previous page"
      >
        <ChevronLeftCircle className="w-4 h-4" />
      </button>

      <span className="text-sm font-medium text-zinc-500 px-3">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 rounded-full hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors flex items-center justify-center text-zinc-400 hover:text-white"
        aria-label="Next page"
      >
        <ChevronRightCircle className="w-4 h-4" />
      </button>
    </div>
  );
};
