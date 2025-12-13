export interface AnswerEntity {
  id: string;
  questionId: string;
  answeredBy: string;
  answerText: string;
  voteCount: number;
  isAccepted: boolean;
  lastEditedAt?:string;
  lastEditedBy?:string|null;
  version:number;
  editCount:number;
  createdAt: Date;
  updatedAt: Date;
}
