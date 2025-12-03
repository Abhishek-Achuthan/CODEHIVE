export interface QuestionEntity {
  id: string;
  title: string;
  descriptionHtml: string;
  askedBy: string;
  answerCount: number;
  isAnswered: boolean;
  tags: string[];
  views: number;
  votes: number;
  acceptedAnswerId?:string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
