import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { QnAService } from "../../../services/qnaService";
import type {
  QuestionListParams,
  QuestionListFilter,
  QuestionSortApi,
} from "../../../shared/types/api/qna";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import type { QuestionListItemView } from "../../../shared/types/view/QuestionListItemView";
import { mapQuestionListItemToView } from "../../../shared/mappers/question.mapper";

const LIMIT = 5;

type FilterInput = {
  status: "all" | "answered" | "unanswered";
  tags: string[];
  dateFrom: string;
};

export function useQuestionsList() {
  const [activeFilter, setActiveFilter] = useState<string>("newest");
  const [sortBy, setSortBy] = useState<QuestionSortApi>("newest");
  const [filterStateApi, setFilterStateApi] = useState<QuestionListFilter | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebounce<string>(searchTerm, 500);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [questions, setQuestions] = useState<QuestionListItemView[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchQuestions = async (): Promise<void> => {
    setLoading(true);
    try {
      const params: QuestionListParams = {
        page: currentPage,
        limit: LIMIT,
        sortBy,
        filter: filterStateApi ?? undefined,
        search: debouncedSearch || undefined,
      };

      const res = await QnAService.listQuestion(params);

      const items = Array.isArray(res?.items) ? res.items.map(mapQuestionListItemToView) : [];
      setQuestions(items);
      setTotalQuestions(typeof res?.totalItems === "number" ? res.totalItems : 0);
    } catch {
      toast.error("Error fetching questions");
      setQuestions([]);
      setTotalQuestions(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, filterStateApi, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const applyQuickFilter = (type: string): void => {
    setActiveFilter(type);
    setCurrentPage(1);

    const map: Record<
      string,
      { sort: QuestionSortApi; filter: QuestionListFilter | null }
    > = {
      newest: { sort: "newest", filter: null },
      "most-answered": { sort: "most_answered", filter: null },
      "most-viewed": { sort: "most_viewed", filter: null },
      "most-voted": { sort: "most_voted", filter: null },
      answered: {
        sort: "newest",
        filter: { status: "answered" },
      },
      unanswered: {
        sort: "newest",
        filter: { status: "unanswered" },
      },
    };

    const cfg = map[type] ?? map.newest;
    setSortBy(cfg.sort);
    setFilterStateApi(cfg.filter);
  };

  const setFilterState = (filters: FilterInput | null) => {
    if (!filters) {
      setFilterStateApi(null);
      return;
    }

    const apiFilter: QuestionListFilter = {
      status: filters.status,
      tags: filters.tags,
      dateFrom: filters.dateFrom || undefined,
    };

    setFilterStateApi(apiFilter);
  };

  return {
    questions,
    loading,
    totalQuestions,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    setSortBy,
    setFilterState,
    applyQuickFilter,
  };
}
