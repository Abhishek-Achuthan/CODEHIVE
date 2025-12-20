import { useEffect, useState } from "react";
import { type AnswerView } from "../../../shared/types/view/AnswerView";
import type { AnswerSortApi } from "../../../shared/types/api/qna";
import { useDebounce } from "../../admin/hooks/useDebounce";
import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";
import { mapAnswerToView } from "../../../shared/mappers/answer.mapper";

const PAGE_SIZE = 5;

export function useAnswerList(questionId: string | undefined) {
  const [answers, setAnswers] = useState<AnswerView[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<AnswerSortApi>("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [loading, setLoading] = useState(false);

  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (!questionId) return;

    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);

        const res = await QnAService.listAnswers({
          questionId,
          page: currentPage,
          limit: PAGE_SIZE,
          sortBy,
          search: debouncedSearch || undefined,
        });

        if (cancelled) return;

        const mapped = (res?.items ?? []).map(mapAnswerToView);
        setAnswers(mapped);
        setMeta({
          totalItems: res?.totalItems ?? 0,
          totalPages: res?.totalPages ?? 0,
        });
      } catch (error) {
        if (error instanceof BaseError) toast.error(error.message);
        setAnswers([]);
        setMeta({ totalItems: 0, totalPages: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [questionId, currentPage, sortBy, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy]);

  return {
    answers,
    loading,

    totalItems: meta.totalItems,
    totalPages: meta.totalPages,
    currentPage,
    sortBy,
    searchTerm,

    actions: {
      changePage: setCurrentPage,
      changeSearch: setSearchTerm,
      changeSort: (v: AnswerSortApi) => {
        setSortBy(v);
        setCurrentPage(1);
      },
    },
  };
}
