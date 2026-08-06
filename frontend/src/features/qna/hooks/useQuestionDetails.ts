import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { useAnswers } from "./useAnswers";
import { useQuestionVote } from "./useQuestionVote";
import { useBookmark } from "./useBookmark";
import { useQuestionFetch } from "./useQuestionFetch";

export function useQuestionDetails(questionId: string | undefined) {
  const currentUser = useAppSelector((s) => s.auth.user);
  
  const questionFetch = useQuestionFetch(questionId);
  const answers = useAnswers(questionId, currentUser);
  const questionVote = useQuestionVote(questionId, questionFetch?.question?.voteCount);
  const bookmark = useBookmark(questionId, Boolean(questionFetch?.question?.bookmarked)); 
  
  return {
    loading: questionFetch.loading,

    question: questionFetch.question,
    relatedQuestions: questionFetch.relatedQuestions,

    answers: answers.answers,
    isPostingAnswer: answers.isPosting,
    answersLoading: answers.loading,
    hasMoreAnswers: answers.hasMore,
    totalAnswers: answers.totalAnswers,
    totalPages: answers.totalPages,
    currentPage: answers.currentPage,
    searchTerm: answers.searchTerm,
    sortBy: answers.sortBy,

    isBookmarked: bookmark.isBookmarked,

    questionVote,
    answerVotes: answers.votes,

    actions: {
      ...answers.actions,
      toggleBookmark: bookmark.toggle,
    },
  };
}
