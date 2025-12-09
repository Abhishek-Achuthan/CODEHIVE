import Sidebar from "../components/SideBar";
import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import QuestionsList from "../components/QuestionList";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuestionsList } from "../hooks/useListQuestions";
import type { QuestionListFilter } from "../../../shared/types/api";
import type { FilterState } from "../components/FilterModal";

export default function QnaLandigPage() {
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
  } = useQuestionsList();

  const totalPages = Math.ceil(totalQuestions / 5);

  const handleAskQuestion = (): void => {
    navigate("/qna/ask-question");
  };

  const handleQuestionClick = (id: string): void => {
    navigate(`/qna/question/${id}`);
  };

  const handleApplyFilters = (filters: FilterState): void => {
    const questionFilters : QuestionListFilter = {
      ...filters,
        dateFrom: filters.dateFrom || undefined
    }
    setFilterState(questionFilters);
    setActiveFilter("filter");
    setIsFilterOpen(false);
  };

  return (
    <div className="dark min-h-screen bg-background relative">
      <div
        className="fixed inset-0 bg-linear-to-b from-[oklch(0.35_0.15_280)] via-[oklch(0.12_0.04_270)] to-[oklch(0.08_0_0)] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, oklch(0.35 0.15 280) 0%, oklch(0.15 0.08 275) 15%, oklch(0.08 0 0) 40%, oklch(0.08 0 0) 100%)",
          filter: "blur(120px)",
          opacity: 0.5,
          zIndex: -1,
        }}
      />
      <Header />
      <div className="flex relative z-0">
        <Sidebar />
        <main className="flex-1">
          <QuestionsList
            questions={questions}
            loading={loading}
            totalQuestions={totalQuestions}
            currentPage={currentPage}
            totalPages={totalPages}
            searchTerm={searchTerm}
            activeFilter={activeFilter}
            isFilterOpen={isFilterOpen}
            onSearchChange={setSearchTerm}
            onPageChange={setCurrentPage}
            onAskQuestion={handleAskQuestion}
            onQuestionClick={handleQuestionClick}
            onQuickFilterChange={applyQuickFilter}
            onOpenFilterModal={() => setIsFilterOpen(true)}
            onCloseFilterModal={() => setIsFilterOpen(false)}
            onApplyFilters={handleApplyFilters}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}
