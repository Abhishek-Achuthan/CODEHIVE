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
