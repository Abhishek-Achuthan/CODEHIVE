import type { JSX } from "react";
import { Pagination } from "../../../shared/ui/Pagination";
import { FilterModal, type FilterState as FMFilterState } from "./FilterModal";
import { QuestionFilters } from "./QuestionFilters";
import { QuestionHeader } from "./QuestionHeader";
import { QuestionContent } from "./QuestionContent";
import { SearchInput } from "./SearchInput";
import { getTitle } from "../util/getTitle";

import type { QuestionCardProps } from "./QuestionCard";

type Question = QuestionCardProps & { id: string | number };

type QuestionsListProps = {
  questions: Question[];
  loading: boolean;
  totalQuestions: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  activeFilter: string;
  isFilterOpen: boolean;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAskQuestion: () => void;
  onQuestionClick: (id: string) => void;
  onQuickFilterChange: (type: string) => void;
  onOpenFilterModal: () => void;
  onCloseFilterModal: () => void;
  onApplyFilters: (filters: FMFilterState) => void;
};

export default function QuestionsList(props: QuestionsListProps): JSX.Element {
  const {
    questions,
    loading,
    totalQuestions,
    currentPage,
    totalPages,
    searchTerm,
    activeFilter,
    isFilterOpen,
    onSearchChange,
    onPageChange,
    onAskQuestion,
    onQuestionClick,
    onQuickFilterChange,
    onOpenFilterModal,
    onCloseFilterModal,
    onApplyFilters,
  } = props;

  const title = getTitle(activeFilter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SearchInput value={searchTerm} onChange={onSearchChange} />

      <QuestionHeader
        title={title}
        total={totalQuestions}
        onAsk={onAskQuestion}
        filters={
          <QuestionFilters
            activeFilter={activeFilter}
            onSelect={onQuickFilterChange}
            onOpenAdvanced={() =>
              isFilterOpen ? onCloseFilterModal() : onOpenFilterModal()
            }
          />
        }
      />

      <FilterModal
        open={isFilterOpen}
        onOpenChange={(open) =>
          open ? onOpenFilterModal() : onCloseFilterModal()
        }
        onApply={onApplyFilters}
      />
      
      <QuestionContent
        loading={loading}
        questions={questions}
        onSelect={onQuestionClick}
      />

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
