import { AnswerSort } from '../../domain/types/AnswerSort';
import { AuthorInfo } from '../../domain/types/AuthorInfo';

export interface IAnswerResponseDTO {
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

export interface IGetAnswerResponseDTO {
  id: string;
  answerText: string;
  authorId: string;
  questionId: string;
  version: number;
}

export interface ICreateAnswerInputDTO {
  questionId: string;
  answeredBy: string;
  answerText: string;
}

export interface IUpdateAnswerInputDTO {
  id: string;
  answerText?: string;
}

export interface IAnswerListQueryDTO {
  questionId: string;
  page?: number;
  limit?: number;
  sortBy?: AnswerSort;
  search?: string;
}

export interface AnswerWithAuthorDTO {
  answer: IAnswerResponseDTO;
  author: AuthorInfo;
}

export interface IEditAnswerInputDTO {
  userId:string ;
  answerText?:string;
  answerId?:string;
  version:number;
}

export interface IAcceptAnswerInputDTO {
  questionId: string;
  answerId: string;
  userId: string;
}
