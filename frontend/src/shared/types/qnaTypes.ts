import type { User } from "./userTypes";
import type { ListQueryParams, PaginatedResponse } from "./sharedTypes";


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

export interface GetQuestionData {
  author: Partial<User>;
  question: Question;
  isBookmarked: boolean;
}

export type questionList = {
  filter?: QuestionListFilter;
  page?: number;
  tags?: string[];
  limit?: number;
  sortBy?: QuestionSort;
  search?: string;
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

export interface QuestionListFilter {
  tags?: string[];
  status?: QuestionStatus;
  bookmarkedOnly?: boolean;
  dateFrom?: string;
}

export type QuestionStatus = "all" | "answered" | "unanswered";

export type QuestionSort =
  | "newest"
  | "oldest"
  | "most_answered"
  | "least_answered"
  | "most_viewed"
  | "most_voted";

export type CreateQuestion = {
  title: string;
  descriptionHtml: string;
  askedBy: string;
  tags: string[];
};

export type RelatedQuestions = {
  id: string;
  title: string;
  tags: string[];
  votes: number;
  answerCount: number;
  views: number;
};

export interface RelatedQuestionsSectionProps {
  relatedQuestions: Partial<Question>[];
}

export interface CreateAnswerDTO {
  answerText: string;
  questionId: string;
}

export interface AnswerAuthorDTO {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
}

export interface AnswerDTO {
  id: string;
  answerText: string;
  isAccepted: boolean;
  voteCount: number; 
  createdAt: string;
  updatedAt: string;
  author: string;
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

export type AnswerSort = 'newest' | 'votes' | 'oldest';


export type PaginatedAnswerResponse = PaginatedResponse<AnswerWithAuthorAPI>;

export type AnswerListParams = Omit<ListQueryParams<never,AnswerSort>,'filter'> & {
  questionId:string;
}
