import { useState, useEffect } from 'react';
import { QnAService } from '../../../services/qnaService';

interface AnswerData {
    id: string;
    answerText: string;
    authorId: string;
    questionId: string;
    version: number;
}

export const useFetchAnswer = (answerId: string | undefined) => {
  const [data, setData] = useState<AnswerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!answerId) return;

    const fetchAnswer = async () => {
      try {
        setLoading(true);
        const response = await QnAService.getAnswer(answerId);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch answer'));
      } finally {
        setLoading(false);
      }
    };

    fetchAnswer();
  }, [answerId]);

  return { data, loading, error };
};
