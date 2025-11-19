import { QuestionListFilter } from '../../domain/types/QuestionListFilter';
import { QuestionSort } from '../../domain/types/QuestionSort';

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
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateQuestionInputDTO {
  title: string ;
  description: string;
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
