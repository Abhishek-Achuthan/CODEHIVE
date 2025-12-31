import { useState } from "react";
import toast from "react-hot-toast";

import { QnAService } from "../../../services/qnaService";
import { BaseError } from "../../../shared/errors/BaseError";

import type { AnswerView } from "../../../shared/types/view/AnswerView";
import type { AnswerEntityApi } from "../../../shared/types/api/qna";

type VoteValue = 1 | -1 | 0;

interface CurrentUser {
  id: string;
  firstName?: string;
  email?: string;
}

interface UseAnswerActionsParams {
  questionId?: string;
  currentUser: CurrentUser | null;
}

function mapPostedAnswerToView(a: AnswerEntityApi, author: CurrentUser): AnswerView {
  return {
    id: a.id,
    contentHtml: a.answerText,
    isAccepted: a.isAccepted,
    voteCount: a.voteCount,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    author: {
      id: author.id,
      firstName: author.firstName ?? "",
    },
  };
}

export function useAnswerActions({
  questionId,
  currentUser,
}: UseAnswerActionsParams) {
  /* ---------- optimistic answers ---------- */
  const [localAnswers, setLocalAnswers] = useState<AnswerView[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [deletedAnswerIds, setDeletedAnswerIds] = useState<Record<string, true>>({});

  /* ---------- voting state ---------- */
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Record<string, VoteValue>>({});
  const [votingById, setVotingById] = useState<Record<string, boolean>>({});

  /* ---------- accepted state ---------- */
  const [newlyAcceptedId, setNewlyAcceptedId] = useState<string | null | undefined>(
    undefined
  );

  /* ---------- submit answer ---------- */
  const submitAnswer = async (html: string) => {
    if (!questionId || !currentUser || isPosting) return;

    const tempId = `temp-${Date.now()}`;
    const now = new Date().toISOString();

    const tempAnswer: AnswerView = {
      id: tempId,
      contentHtml: html,
      isAccepted: false,
      voteCount: 0,
      createdAt: now,
      updatedAt: now,
      author: {
        id: currentUser.id,
        firstName: currentUser.firstName ?? "",
      },
    };

    setLocalAnswers((prev) => [tempAnswer, ...prev]);

    try {
      setIsPosting(true);

      const res = await QnAService.postAnswer({
        questionId,
        answerText: html,
      });

      const mapped = mapPostedAnswerToView(res.data, currentUser);

      setLocalAnswers((prev) =>
        prev.map((a) => (a.id === tempId ? mapped : a))
      );
    } catch (error) {
      setLocalAnswers((prev) => prev.filter((a) => a.id !== tempId));
      if (error instanceof BaseError) toast.error(error.message);
    } finally {
      setIsPosting(false);
    }
  };

  /* ---------- vote answer ---------- */
  const vote = async (answerId: string, value: 1 | -1) => {
    if (votingById[answerId]) return;

    try {
      setVotingById((p) => ({ ...p, [answerId]: true }));

      const res = await QnAService.voteAnswer(answerId, value);
      if (!res) return;

      setVoteCounts((p) => ({ ...p, [answerId]: res.voteCount }));
      setUserVotes((p) => ({ ...p, [answerId]: res.userVote }));
    } catch (error) {
      if (error instanceof BaseError) toast.error(error.message);
    } finally {
      setVotingById((p) => ({ ...p, [answerId]: false }));
    }
  };

  return {
    localAnswers,
    isPosting,
    newlyAcceptedId,
    deletedAnswerIds,

    votes: {
      getCount: (id: string, fallback = 0) =>
        voteCounts[id] ?? fallback,
      getUserVote: (id: string) => userVotes[id] ?? 0,
      vote,
    },
    //optimistic updte
    actions: {
      submitAnswer,
      acceptAnswer: async (answerId: string) => {
        if (!questionId) return false;
        const prev = newlyAcceptedId;
        try {
          setNewlyAcceptedId(answerId);
          await QnAService.acceptAnswer({ questionId, answerId });
          toast.success("Answer accepted");
          return true;
        } catch (error) {
          if (error instanceof BaseError) toast.error(error.message);
          setNewlyAcceptedId(prev);
          return false;
        }
      },
      removeAcceptedAnswer: async () => {
        if (!questionId) return false;

        const prev = newlyAcceptedId;
        // clear accepted answer optimistic
        setNewlyAcceptedId(null);

        try {
          await QnAService.removeAcceptedAnswer(questionId);
          toast.success("Accepted answer removed");
          return true;
        } catch (error) {
          setNewlyAcceptedId(prev);
          const message =
            error instanceof BaseError
              ? error.message
              : "Failed to remove accepted answer";
          toast.error(message);
          return false;
        }
      },
      deleteAnswer: async (answerId: string) => {
        setDeletedAnswerIds((prev) => ({ ...prev, [answerId]: true }));
        setLocalAnswers((prev) => prev.filter((a) => a.id !== answerId));

        try {
          await QnAService.deleteAnswer(answerId);
          toast.success("Answer deleted");
          return true;
        } catch (error) {
          setDeletedAnswerIds((prev) => {
            const next = { ...prev };
            delete next[answerId];
            return next;
          });

          const message = error instanceof BaseError ? error.message : "Failed to delete answer";
          toast.error(message);
          return false;
        }
      },
    },
  };
}
