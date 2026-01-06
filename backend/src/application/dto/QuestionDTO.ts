
import { QuestionListFilter } from '../../domain/types/QuestionListFilter';
import { QuestionSort } from '../../domain/types/QuestionSort';
import { AuthorInfo } from '../../domain/types/AuthorInfo';

export interface IQuestionResponseDTO {
  id: string;
  title: string;
  descriptionHtml: string;
  askedBy: string;
  answerCount: number;
  isAnswered: boolean;
  tags: string[];
  views: number;
  votes: number;
  acceptedAnswerId?: string | null;
  createdAt: string;
  updatedAt: string | null;
  lastEditedAt?: string | undefined;
  lastEditedBy?: string | null | undefined;
  editCount?: number;
  version?: number;
}

export interface ICreateQuestionInputDTO {
  title: string;
  descriptionHtml: string;
  askedBy: string;
  tags: string[];
}

export interface IUpdateQuestionInputDTO {
  id: string;
  title?: string;
  description?: string;
  tags?: string[];
}

export interface IQuestionListQueryDTO {
  filter?: QuestionListFilter
  page?: number;
  limit?: number;
  sortBy?: QuestionSort
  search?: string;
}

export type ToggleSavedQuestionResult = {
  isBookmarked: boolean;
}

export interface QuestionWithAuthorDTO {
  question: IQuestionResponseDTO;
  author: AuthorInfo;
  isBookmarked: boolean;
}

export interface EditQuestionInputDTO {
  title?: string;
  descriptionHtml?: string;
  tags?: string[];
  version: number
}
