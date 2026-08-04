import type { AnswerWithAuthorAPI, AnswerEntityApi } from "../types/api/qna";
import type { AnswerView } from "../types/view/AnswerView";

export function mapAnswerToView(
  a: AnswerWithAuthorAPI
): AnswerView {
  return {
    id: a.answer.id,
    contentHtml: a.answer.answerText,
    isAccepted: a.answer.isAccepted,
    voteCount: a.answer.voteCount,
    createdAt: a.answer.createdAt,
    updatedAt: a.answer.updatedAt,
    author: {
      id: a.author.id,
      firstName: a.author.firstName,
    },
  };
}
export function mapPostedAnswerToView(
  a: AnswerEntityApi,
  author: { id: string; firstName?: string }
): AnswerView {
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
