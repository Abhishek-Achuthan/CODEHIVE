import { AnswerSort } from '../../domain/types/AnswerSort';

export interface IAnswerResponseDTO {
  id: string;
  questionId: string;
  answeredBy: string;
  answerText: string;
  voteCount: number;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export interface IEditAnswerInputDTO {
  userId:string ;
  answerText?:string;
  answerId?:string;
  version:number;
}
