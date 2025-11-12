import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import type { PaginationProps } from '../types/sharedTypes'

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
        className="w-8 h-8 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors flex items-center justify-center"
        aria-label="Previous page"
      >
        <ChevronLeftCircle className="w-4 h-4 text-white  hover:text-gray-700" />
      </button>

      <span className="text-sm text-gray-600 px-3">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors flex items-center justify-center"
        aria-label="Next page"
      >
        <ChevronRightCircle className="w-4 h-4 text-white hover:text-gray-700" />
      </button>
    </div>
  );
};
