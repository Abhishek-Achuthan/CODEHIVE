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

  const deletedCount = useMemo(() => {
    return Object.keys(actions.deletedAnswerIds).filter((id) => !id.startsWith('temp-')).length;
  }, [actions.deletedAnswerIds]);

  const shouldShowLocal =
    list.currentPage === 1 && list.searchTerm.length === 0;

  const answers = useMemo<AnswerView[]>(() => {
    const merged = [
      ...(shouldShowLocal ? actions.localAnswers : []),
      ...list.answers,
    ];

    const seen = new Set<string>();
    return merged
      .filter((a) => !actions.deletedAnswerIds[a.id])
      .filter((a) => {
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      })
      .map((a) => {
        if (actions.newlyAcceptedId !== undefined) {
          // If we have a local accepted override, enforce it (including explicit null)
          return { ...a, isAccepted: a.id === actions.newlyAcceptedId };
        }
        return a;
      });
  }, [list.answers, actions.localAnswers, actions.deletedAnswerIds, shouldShowLocal, actions.newlyAcceptedId]);

  return {
    /* ---------- data ---------- */
    answers,
    loading: list.loading,
    isPosting: actions.isPosting,

    totalAnswers: Math.max(
      0,
      list.totalItems - deletedCount +
        (shouldShowLocal ? actions.localAnswers.length : 0)
    ),

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
