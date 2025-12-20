import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";

type VoteValue = 1 | -1 | 0;

export function useQuestionVote(
  questionId: string | undefined,
  votes: number | undefined
) {
  const [count, setCount] = useState<number>(0);
  const [userVote, setUserVote] = useState<VoteValue>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof votes === "number") {
      setCount(votes);
      setUserVote(0);
    }
  }, [votes]);

  const vote = async (value: 1 | -1) => {
    if (!questionId || loading) return;

    try {
      setLoading(true);
      const res = await QnAService.voteQuestion(questionId, value);
      if (!res) return;

      setCount(res.votes);
      setUserVote(res.userVote);
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { count, userVote, loading, vote };
}
