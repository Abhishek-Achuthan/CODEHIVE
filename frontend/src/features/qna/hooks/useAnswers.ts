import { useMemo } from "react";

import { useAnswerList } from "./useAnswerList";
import { useAnswerActions } from "./useAnswerActions";

import type { AnswerView } from "../../../shared/types/view/AnswerView";

interface CurrentUser {
  id: string;
  firstName?: string;
  email?: string;
}

export function useAnswers(
  questionId: string | undefined,
  currentUser: CurrentUser | null
) {
  const list = useAnswerList(questionId);
  const actions = useAnswerActions({ questionId, currentUser });

  const shouldShowLocal =
    list.currentPage === 1 && list.searchTerm.length === 0;

  const answers = useMemo<AnswerView[]>(() => {
    const merged = [
      ...(shouldShowLocal ? actions.localAnswers : []),
      ...list.answers,
    ];

    const seen = new Set<string>();
    return merged.filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    }).map(a => {
      if (actions.newlyAcceptedId) {
        // If we have a local accepted action, override isAccepted
        return { ...a, isAccepted: a.id === actions.newlyAcceptedId };
      }
      return a;
    });
  }, [list.answers, actions.localAnswers, shouldShowLocal, actions.newlyAcceptedId]);

  return {
    /* ---------- data ---------- */
    answers,
    loading: list.loading,
    isPosting: actions.isPosting,

    totalAnswers:
      list.totalItems +
      (shouldShowLocal ? actions.localAnswers.length : 0),

    totalPages: list.totalPages,
    currentPage: list.currentPage,
    sortBy: list.sortBy,
    searchTerm: list.searchTerm,

    /* ---------- votes ---------- */
    votes: actions.votes,

    /* ---------- actions ---------- */
    actions: {
      ...list.actions,
      ...actions.actions,
    },
  };
}
