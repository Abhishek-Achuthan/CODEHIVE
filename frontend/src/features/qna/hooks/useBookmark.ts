import { useEffect, useState } from "react";
import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";

export function useBookmark(
  questionId: string | undefined,
  initialValue: boolean
) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(initialValue);
  const [loading, setLoading] = useState<boolean>(false);

  // keep state in sync when question changes
  useEffect(() => {
    setIsBookmarked(initialValue);
  }, [initialValue]);

  const toggle = async () => {
    if (!questionId || loading) return;

    try {
      setLoading(true);
      const res = await QnAService.saveQuestion(questionId);
      setIsBookmarked(Boolean(res.data));
      toast.success(res.message);
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    isBookmarked,
    loading,
    toggle,
  };
}
