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
  const { question, author, isBookmarked } = data;

  return {
    id: question.id,
    title: question.title,
    contentHtml: question.descriptionHtml,

    author: {
      id: author.id!,
      firstName: author.firstName!,
      avatarUrl: author.avatarUrl,
    },

    tags: question.tags,

    voteCount: question.votes,
    userVote: 0, 

    views: question.views,
    answerCount: question.answerCount,

    bookmarked: isBookmarked,

    createdAt: question.createdAt,
    lastEditedAt:
      question.lastEditedAt ?? question.createdAt,
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
