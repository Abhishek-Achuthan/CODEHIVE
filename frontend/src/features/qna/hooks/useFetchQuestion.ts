import { useEffect, useState } from "react";
import type { GetQuestionData, RelatedQuestion } from "../../../shared/types/domain/qna";
import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";

export function useFetchQuestion(questionId: string | undefined) {
  const [data, setData] = useState<GetQuestionData | undefined>();
  const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (!questionId) return;

    let cancelled = false;
      
    const fetchQuestion = async (id: string) => {
      try {
        setLoading(true);

        const [questionRes, relatedRes] = await Promise.all([
          QnAService.getQuestion(id),
          QnAService.relatedQuestions(id),
        ]);

        if (cancelled) return;

        setData(questionRes);
        setRelatedQuestions(relatedRes ?? []);
        console.log(questionRes,'question responce form y')

      } catch (error) {
        if (error instanceof BaseError) {
          toast.error(error.message);
        } else {
          console.error(error);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchQuestion(questionId);
    
    return () => {
      cancelled = true;
    };
  }, [questionId]);

  return { data, loading, relatedQuestions };
}
