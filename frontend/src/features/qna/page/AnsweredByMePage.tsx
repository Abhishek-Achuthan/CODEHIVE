import { useState } from "react";
import { useNavigate } from "react-router-dom";

import QnaLayout from "../../../layouts/QnaLayout";
import QuestionsList from "../components/QuestionList";
import { useAnsweredQuestions } from "../hooks/useAnsweredQuestions";
import type { FilterState } from "../components/FilterModal";

export default function AnsweredByMePage() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    questions,
    loading,
    totalQuestions,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setFilterState,
    setActiveFilter,
    applyQuickFilter,
  } = useAnsweredQuestions();

  const totalPages = Math.ceil(totalQuestions / 5);

  const emptyMessage =
    !loading && totalQuestions === 0 && searchTerm.trim() === ""
      ? "You haven't answered any questions yet."
      : undefined;

  const handleApplyFilters = (filters: FilterState): void => {
    setFilterState(filters);
    setActiveFilter("filter");
    setIsFilterOpen(false);
  };

  return (
    <QnaLayout>
      <QuestionsList
        questions={questions}
        loading={loading}
        totalQuestions={totalQuestions}
        currentPage={currentPage}
        totalPages={totalPages}
        searchTerm={searchTerm}
        activeFilter={activeFilter}
        isFilterOpen={isFilterOpen}
        emptyMessage={emptyMessage}
        onSearchChange={setSearchTerm}
        onPageChange={setCurrentPage}
        onAskQuestion={() => navigate("/qna/ask-question")}
        onQuestionClick={(id) => navigate(`/qna/question/${id}`)}
        onQuickFilterChange={applyQuickFilter}
        onOpenFilterModal={() => setIsFilterOpen(true)}
        onCloseFilterModal={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </QnaLayout>
  );
}
