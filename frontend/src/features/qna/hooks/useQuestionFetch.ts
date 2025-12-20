import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";
import type { QuestionDetailsView } from "../../../shared/types/view/QuestionDetailsView";
import { mapQuestionToView, mapRelatedQuestionToView } from "../../../shared/mappers/question.mapper";
import type { RelatedQuestionView } from "../../../shared/types/view/RelatedQuestionView";

export function useQuestionFetch(
  questionId: string | undefined
) {
  const [question, setQuestion] = useState<QuestionDetailsView>();
  const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestionView[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!questionId) return;

    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);

        const [questionRes, relatedRes] = await Promise.all([
          QnAService.getQuestion(questionId),
          QnAService.relatedQuestions(questionId),
        ]);

        if (cancelled) return;
        setQuestion(mapQuestionToView(questionRes));
        setRelatedQuestions(Array.isArray(relatedRes) ? relatedRes.map(mapRelatedQuestionToView) : []);
      } catch (error) {
        if (error instanceof BaseError) {
          toast.error(error.message);
        } else {
          toast.error("Failed to load question");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [questionId]);

  return {
    question,
    relatedQuestions,
    loading,
  };
}
