import type { PaginatedResponse } from "../core/api";
import type { ListQueryParams } from "../core/api";

export type QuestionStatusApi = "all" | "answered" | "unanswered";

export type QuestionSortApi =
  | "newest"
  | "oldest"
  | "most_answered"
  | "least_answered"
  | "most_viewed"
  | "most_voted";

export type AnswerSortApi = "newest" | "votes" | "oldest";

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

export interface CreateAcceptedAnswerRequest {
  questionId : string,
  answerId : string,
}

export interface EditQuestionRequest {
  questionId: string;
  title?: string;
  descriptionHtml?: string;
  tags?: string[];
  version: number;
}

export interface EditAnswerRequest {
  answerId: string;
  version: number;
  answerText: string;
}

export type SimpleSuccessResponse = {
  success: boolean;
};

export type CreateSavedListRequest = {
  name: string;
};

export type SavedListAPIResponse = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type SavedQuestionListIdsResponse = {
  listIds: string[];
};
// Request params
export interface QuestionListFilter {
  tags?: string[];
  status?: QuestionStatusApi;
  bookmarkedOnly?: boolean;
  dateFrom?: string;
}


export type QuestionListParams = ListQueryParams<
  QuestionListFilter,
  QuestionSortApi
> & {
  tags?: string[];
};

export type AnswerListParams = Omit<
  ListQueryParams<never, AnswerSortApi>,
  "filter"
> & {
  questionId: string;
};


//-------------------------------- Response DTOs----------------------------------------//
export interface AnswerEntityApi {
  id: string;
  questionId: string;
  answeredBy: string;
  answerText: string;
  voteCount: number;
  isAccepted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  lastEditedAt?: string;
  lastEditedBy?: string | null;
  editCount?: number;
}

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
    version: number;
    createdAt: string;
    updatedAt: string;
  };
  author: AnswerAuthorDTO;
}

export type GetQuestionAPIResponse = {
  author: {
    id: string;
    firstName: string;
    avatarUrl?: string;
  };
  question: {
    id: string;
    title: string;
    descriptionHtml: string;
    tags: string[];
    votes: number;
    views: number;
    answerCount: number;
    createdAt: string;
    updatedAt?: string;
    version: number;
  };
  isBookmarked: boolean;
};

export type GetAnswerAPIResponse = {
  id: string;
  answerText: string;
  authorId: string;
  questionId: string;
  version: number;
};

export type CreateQuestionApiResponse = {
  success: boolean;
  message?: string;
  messsage?: string;
  data?: unknown;
};

export type EditQuestionApiResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

export type PostAnswerApiResponse = {
  success: boolean;
  message: string;
  data: AnswerEntityApi;
};

export type EditAnswerApiResponse = {
  success: boolean;
  message: string;
  data: AnswerEntityApi | null;
};

export type SaveQuestionApiResponse = {
  success: boolean;
  data: boolean;
  message: string;
};

export type QuestionListAPIResponse = {
  id: string;
  title: string;
  descriptionHtml: string;
  tags: string[];
  votes: number;
  answerCount: number;
  views: number;
};

export type AcceptAnswerAPIResponse = {
  success: boolean;
  message: string;
  data: AnswerEntityApi | null;
}

export type AiChatSessionAPI = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type AiChatMessageAPI = {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type AiAssistResponse = {
  sessionId: string;
  response: string;
};

export type QuestionListPaginatedResponse =
  PaginatedResponse<QuestionListAPIResponse>;

export type PaginatedAnswerResponse = PaginatedResponse<AnswerWithAuthorAPI>;

