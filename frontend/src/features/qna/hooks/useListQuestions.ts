import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { QnAService } from "../../../services/qnaService";
import type {
  QuestionListParams,
  QuestionListFilter,
} from "../../../shared/types/api/qna";
import type {
  QuestionSort,
  QuestionStatus,
  QuestionListItem,
} from "../../../shared/types/domain/qna.types";
import { useDebounce } from "../../admin/hooks/useDebounce";

const LIMIT = 5;

export function useQuestionsList() {
  const [activeFilter, setActiveFilter] = useState<string>("newest");
  const [sortBy, setSortBy] = useState<QuestionSort>("newest");
  const [filterState, setFilterState] =
    useState<QuestionListFilter | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebounce<string>(searchTerm, 500);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchQuestions = async (): Promise<void> => {
    setLoading(true);
    try {
      const params: QuestionListParams = {
        page: currentPage,
        limit: LIMIT,
        sortBy,
        filter: filterState ?? undefined,
        search: debouncedSearch || undefined,
      };

      const res = await QnAService.listQuestions(params);

      setQuestions(Array.isArray(res?.items) ? res.items : []);
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
  }, [currentPage, sortBy, filterState, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const applyQuickFilter = (type: string): void => {
    setActiveFilter(type);
    setCurrentPage(1);

    const map: Record<
      string,
      { sort: QuestionSort; filter: QuestionListFilter | null }
    > = {
      newest: { sort: "newest", filter: null },
      "most-answered": { sort: "most_answered", filter: null },
      "most-viewed": { sort: "most_viewed", filter: null },
      "most-voted": { sort: "most_voted", filter: null },
      answered: {
        sort: "newest",
        filter: { status: "answered" as QuestionStatus },
      },
      unanswered: {
        sort: "newest",
        filter: { status: "unanswered" as QuestionStatus },
      },
    };

    const cfg = map[type] ?? map.newest;
    setSortBy(cfg.sort);
    setFilterState(cfg.filter);
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
