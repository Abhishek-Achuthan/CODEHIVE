export interface AnswerResponseDTO {
  id: string;
  questionId: string;
  answeredBy: string;
  answerText: string;
  voteCount: number;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAnswerInputDTO {
  questionId: string;
  answeredBy: string;
  answerText: string;
}

export interface UpdateAnswerInputDTO {
  id: string; 
  answerText?: string;
}
