export interface QuestionEntity {
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
