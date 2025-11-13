export interface AnswerEntity {
  id: string;
  questionId: string;
  answeredBy: string;
  answerText: string;
  voteCount: number;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
