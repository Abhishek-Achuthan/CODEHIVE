import { QuestionEntity } from '../../domain/entities/qna/QuestionEntity';
import { QuestionListFilter } from '../../domain/types/QuestionListFilter';
import { QuestionSort } from '../../domain/types/QuestionSort';
import { AuthorInfo } from '../../domain/types/QuestionWithAuthor';

export interface IQuestionResponseDTO {
  id: string;
  title: string;
  description: string;
  askedBy: string;
  answerCount: number;
  isAnswered: boolean;
  tags: string[];
  views: number;
  votes: number;
  acceptedAnswerId?:string|null
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateQuestionInputDTO {
  title: string ;
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
  filter?:QuestionListFilter
  page?: number;
  limit?: number;
  sortBy?: QuestionSort
  search?:string;
}

export type ToggleSavedQuestionResult ={
    isBookmarked : boolean;
}

export interface QuestionWithAuthorDTO {
   question:QuestionEntity;
   author:AuthorInfo;
   isBookmarked : boolean;
}
