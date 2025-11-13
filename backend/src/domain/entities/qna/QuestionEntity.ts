export interface QuestionEntity {
  id: string;
  title: string;
  description: string;
  is_answered: boolean;
  tags: string[];
  views: number;
  votes?: number;
  createdAt: Date;
  updatedAt: Date;
}
