import type { User } from "./user";
import type { QuestionListAPIResponse, AnswerWithAuthorAPI } from "../api/qna";

// Domain enums
export type QuestionStatus = "all" | "answered" | "unanswered";

export type QuestionSort =
  | "newest"
  | "oldest"
  | "most_answered"
  | "least_answered"
  | "most_viewed"
  | "most_voted";

export type AnswerSort = "newest" | "votes" | "oldest";

// Domain models
export interface Question {
  id: string;
  title: string;
  descriptionHtml: string;
  votes: number;
  askedBy: string;
  answers: number;
  views: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  bookmarked: boolean;
}

export interface QuestionListItem {
  id: string;
  title: string;
  descriptionHtml: string;
  tags: string[];
  votes: number;
  answers: number;
  views: number;
}

export interface RelatedQuestion {
  id: string;
  title: string;
  tags: string[];
  votes: number;
  answerCount: number;
  views: number;
}

export interface AnswerAuthor {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
}

export interface Answer {
  id: string;
  answerText: string;
  isAccepted: boolean;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
  author: AnswerAuthor;
}

export interface GetQuestionData {
  author: Partial<User>;
  question: Question;
  isBookmarked: boolean;
}

// Mapping functions: API → Domain
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
