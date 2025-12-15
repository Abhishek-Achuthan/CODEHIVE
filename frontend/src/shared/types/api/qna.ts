import type { PaginatedResponse } from "../core/api";
import type { ListQueryParams } from "../core/api";
import type { QuestionSort, AnswerSort, QuestionStatus } from "../domain/qna.types";

//-------------------------------- Request DTOs-----------------------------------------//

export type CreateQuestionRequest = {
  title: string;
  descriptionHtml: string;
  askedBy: string;
  tags: string[];
};

export interface CreateAnswerRequest {
  answerText: string;
  questionId: string;
}

// Request params
export interface QuestionListFilter {
  tags?: string[];
  status?: QuestionStatus;
  bookmarkedOnly?: boolean;
  dateFrom?: string;
}

export type QuestionListParams = ListQueryParams<QuestionListFilter, QuestionSort> & {
  tags?: string[];
};

export type AnswerListParams = Omit<ListQueryParams<never, AnswerSort>, "filter"> & {
  questionId: string;
};

//-------------------------------- Response DTOs----------------------------------------//
export interface AnswerAuthorDTO {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
}

export interface AnswerWithAuthorAPI {
  answer: {
    id: string;
    answerText: string;
    isAccepted: boolean;
    voteCount: number;
    createdAt: string;
    updatedAt: string;
  };
  author: AnswerAuthorDTO;
}

export type QuestionListAPIResponse = {
  id: string;
  title: string;
  descriptionHtml: string;
  tags: string[];
  votes: number;
  answerCount: number;
  views: number;
};

export type QuestionListPaginatedResponse = PaginatedResponse<QuestionListAPIResponse>;

export type PaginatedAnswerResponse = PaginatedResponse<AnswerWithAuthorAPI>;
