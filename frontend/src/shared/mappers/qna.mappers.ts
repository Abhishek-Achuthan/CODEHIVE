// shared/mappers/qna.mappers.ts
import type { QuestionListAPIResponse,AnswerWithAuthorAPI } from '../types/api/qna';
import type { 
  QuestionListItem, 
  RelatedQuestion, 
  Answer 
} from '../types/domain/qna.types';

export function mapQuestionListItemFromApi(
  api: QuestionListAPIResponse
): QuestionListItem {
  return {
    id: api.id,
    title: api.title,
    descriptionHtml: api.descriptionHtml,
    tags: api.tags,
    votes: api.votes,
    answers: api.answerCount,
    views: api.views,
  };
}

export function mapRelatedQuestionFromApi(
  api: QuestionListAPIResponse
): RelatedQuestion {
  return {
    id: api.id,
    title: api.title,
    tags: api.tags,
    votes: api.votes,
    answerCount: api.answerCount,
    views: api.views,
  };
}

export function mapAnswerFromApi(api: AnswerWithAuthorAPI): Answer {
  return {
    id: api.answer.id,
    answerText: api.answer.answerText,
    isAccepted: api.answer.isAccepted,
    voteCount: api.answer.voteCount,
    version: api.answer.version,
    createdAt: api.answer.createdAt,
    updatedAt: api.answer.updatedAt,
    author: {
      id: api.author.id,
      firstName: api.author.firstName,
      lastName: api.author.lastName,
      email: api.author.email,
    },
  };
}