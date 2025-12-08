import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Clock,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Sliders,
} from "lucide-react";
import QuestionCard, { type QuestionCardProps } from "./QuestionCard";
import { FilterModal, type FilterState as FMFilterState } from "./FilterModal";
import { QnAService } from "../../../services/qnaService";
import type {
  QuestionListParams,
  QuestionListFilter,
} from "../../../shared/types/api/qna";
import type { QuestionSort, QuestionStatus, QuestionListItem } from "../../../shared/types/domain/qna";
import toast from "react-hot-toast";
import { Pagination } from "../../../shared/ui/Pagination";
import { useDebounce } from "../../admin/hooks/useDebounce";

type Question = QuestionCardProps & { id: string | number };

export default function QuestionsList(): JSX.Element {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("newest");
  const [sortBy, setSortBy] = useState<QuestionSort>("newest");
  const [filterState, setFilterState] = useState<QuestionListFilter | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebounce<string>(searchTerm, 500); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const LIMIT = 5;

  const fetchQuestions = async (searchValue?: string): Promise<void> => {
    setLoading(true);
    try {
      const params: QuestionListParams = {
        page: currentPage,
        limit: LIMIT,
        sortBy,
        filter: filterState || undefined,
        search: searchValue || undefined,
      };

      const response = await QnAService.listQuestions(params);
      console.log(response)

      const payload = response?.data ?? response ?? {};
      const items: QuestionListItem[] = Array.isArray(payload.items) ? payload.items : [];
      const totalItems =
        typeof payload.totalItems === "number" ? payload.totalItems : 0;

      const mappedQuestions: Question[] = items.map((q: QuestionListItem) => ({
        id: q.id,
        title: q.title,
        description: q.descriptionHtml,
        tags: q.tags ?? [],
        votes: q.votes ?? 0,
        answers: q.answers ?? 0,
        views: q.views ?? 0,
      }));

      setQuestions(mappedQuestions);
      setTotalQuestions(totalItems);
    } catch (error) {
      toast.error("Error fetching questions");
      console.error(error);
      setQuestions([]);
      setTotalQuestions(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, filterState, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleFilterChange = (filterType: string): void => {
    setActiveFilter(filterType);
    setCurrentPage(1);
    let newSortBy: QuestionSort | undefined = undefined;
    let newFilter: QuestionListFilter | null = null;

    switch (filterType) {
      case "newest":
        newSortBy = "newest";
        break;
      case "most-answered":
        newSortBy = "most_answered";
        break;
      case "answered":
        newFilter = { status: "answered" as QuestionStatus };
        newSortBy = "newest";
        break;
      case "unanswered":
        newFilter = { status: "unanswered" as QuestionStatus };
        newSortBy = "newest";
        break;
      case 'most-viewed':
        newSortBy = 'most_viewed'
        break
      case 'most-voted':
        newSortBy = 'most_voted'
        break
    }

    setSortBy(newSortBy ?? "newest");
    setFilterState(newFilter);
    setIsFilterOpen(false);
  };

  const handleGetQuestion = (questionId:string) => {
    navigate(`/qna/question/${questionId}`);
  }


  const handleApplyFilters = (newFilters: FMFilterState): void => {
    const partialFilter: Partial<QuestionListFilter> = {
      tags: newFilters.tags,
      status: newFilters.status
        ? (newFilters.status as QuestionStatus)
        : undefined,
      bookmarkedOnly: newFilters.bookmarkedOnly ?? undefined,
      dateFrom: newFilters.dateFrom ?? undefined,
    };

    const cleanedFilter: Partial<QuestionListFilter> = {};
    Object.entries(partialFilter).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        const filterKey = key as keyof QuestionListFilter;
        if (filterKey in cleanedFilter || filterKey === 'tags' || filterKey === 'status' || filterKey === 'bookmarkedOnly' || filterKey === 'dateFrom') {
          (cleanedFilter as Record<string, unknown>)[key] = value;
        }
      }
    });

    setFilterState(
      Object.keys(cleanedFilter).length > 0 ? cleanedFilter : null
    );
    setActiveFilter("filter");
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const getTitle = (): string => {
    switch (activeFilter) {
      case "newest":
        return "Newest Questions";
      case "answered":
        return "Answered Questions";
      case "unanswered":
        return "Unanswered Questions";
      case "most-answered":
        return "Most Answered Questions";
      case "most-voted":
        return 'Most Voted Questions';
      case "most-viewed":
        return 'Most Viewed Questions'
      case "filter":
        return "Filtered Questions";
      default:
        return "Questions";
    }
  };
 
   const handleAskQuestion = () => {
      navigate('/qna/ask-question')
    }

  const totalPages = Math.ceil(totalQuestions / LIMIT);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-primary" />
        <input
          type="text"
          placeholder="Search here..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value); 
          }}
          className="w-full pl-10 pr-3 py-2 bg-primary/10 border-2 border-primary/30 hover:border-primary/50 rounded-lg text-sm text-foreground placeholder-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition"
        />
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {getTitle()}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-foreground/60">
            {totalQuestions.toLocaleString()} questions
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange("newest")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeFilter === "newest"
                  ? "bg-primary/25 hover:bg-primary/40 text-primary border border-primary/40"
                  : "bg-card hover:bg-card/80 text-foreground/70 border border-border"
              }`}
            >
              <Clock className="w-3 h-3" /> Newest
            </button>

            <button
              onClick={() => handleFilterChange("answered")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeFilter === "answered"
                  ? "bg-primary/25 hover:bg-primary/40 text-primary border border-primary/40"
                  : "bg-card hover:bg-card/80 text-foreground/70 border border-border"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" /> Answered
            </button>

            <button
              onClick={() => handleFilterChange("unanswered")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeFilter === "unanswered"
                  ? "bg-primary/25 hover:bg-primary/40 text-primary border border-primary/40"
                  : "bg-card hover:bg-card/80 text-foreground/70 border border-border"
              }`}
            >
              <HelpCircle className="w-3 h-3" /> Unanswered
            </button>

            <button
              onClick={() => handleFilterChange("most-answered")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeFilter === "most-answered"
                  ? "bg-primary/25 hover:bg-primary/40 text-primary border border-primary/40"
                  : "bg-card hover:bg-card/80 text-foreground/70 border border-border"
              }`}
            >
              <BarChart3 className="w-3 h-3" /> Most answered
            </button>

            <button
              onClick={() => handleFilterChange("most-voted")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeFilter === "most-voted"
                  ? "bg-primary/25 hover:bg-primary/40 text-primary border border-primary/40"
                  : "bg-card hover:bg-card/80 text-foreground/70 border border-border"
              }`}
            >
              <BarChart3 className="w-3 h-3" /> Most Voted
            </button>

            <button
              onClick={() => handleFilterChange("most-viewed")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeFilter === "most-answered"
                  ? "bg-primary/25 hover:bg-primary/40 text-primary border border-primary/40"
                  : "bg-card hover:bg-card/80 text-foreground/70 border border-border"
              }`}
            >
              <BarChart3 className="w-3 h-3" /> Most Viewed
            </button>

            <button
              onClick={() => setIsFilterOpen(true)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                activeFilter === "filter"
                  ? "bg-primary/25 hover:bg-primary/40 text-primary border border-primary/40"
                  : "bg-accent/20 hover:bg-accent/35 text-accent border border-accent/40"
              }`}
            >
              <Sliders className="w-3 h-3" /> Filter
            </button>
          </div>

          <button className="ml-auto px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg text-sm font-medium transition border border-white" onClick={handleAskQuestion}>
            Ask question
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-foreground/60 text-center py-8">
            Loading questions...
          </p>
        ) : questions.length === 0 ? (
          <p className="text-foreground/60 text-center py-8">
            No questions found. Try adjusting your filters.
          </p>
        ) : (
          questions.map((q) => <QuestionCard key={q.id} {...q} onclick={() => handleGetQuestion(q.id.toString())}/>)
        )}
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <FilterModal
        open={isFilterOpen}
        onOpenChange={(open) => setIsFilterOpen(open)}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
