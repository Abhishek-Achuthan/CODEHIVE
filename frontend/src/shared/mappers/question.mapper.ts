import type { QuestionListAPIResponse, GetQuestionAPIResponse } from "../types/api/qna";
import type { QuestionDetailsView } from "../types/view/QuestionDetailsView";
import type { QuestionListItemView } from "../types/view/QuestionListItemView";
import type { RelatedQuestionView } from "../types/view/RelatedQuestionView";

export function mapQuestionListItemToView(
  api: QuestionListAPIResponse
): QuestionListItemView {
  return {
    id: api.id,
    title: api.title,
    contentHtml: api.descriptionHtml,
    tags: api.tags,
    voteCount: api.votes,
    answerCount: api.answerCount,
    views: api.views,
  };
}

export function mapQuestionToView(
  data: GetQuestionAPIResponse
): QuestionDetailsView {
  const { question, author, isBookmarked } = data || {};

  return {
    id: question?.id || "",
    title: question?.title || "",
    contentHtml: question?.descriptionHtml || "",

    author: {
      id: author?.id || "",
      firstName: author?.firstName || "Deleted User",
      avatarUrl: author?.avatarUrl,
    },

    tags: question?.tags || [],

    voteCount: question?.votes || 0,
    userVote: 0, 

    views: question?.views || 0,
    answerCount: question?.answerCount || 0,
    isAnswered: Boolean(question?.isAnswered),
    acceptedAnswerId: question?.acceptedAnswerId || null,

    bookmarked: Boolean(isBookmarked),

    createdAt: question?.createdAt || new Date().toISOString(),
    version: question?.version || 1,
    lastEditedAt:
      question?.lastEditedAt ?? question?.createdAt ?? new Date().toISOString(),
  };
}

export function mapRelatedQuestionToView(
  q: QuestionListAPIResponse
): RelatedQuestionView {
  return {
    id: q.id,
    title: q.title,
    tags: q.tags,
    voteCount: q.votes,
    answerCount: q.answerCount,
    views: q.views,
  };
}
