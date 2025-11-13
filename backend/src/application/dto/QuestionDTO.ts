export interface QuestionResponseDTO {
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

export interface CreateQuestionInputDTO {
  title: string;
  description: string;
  askedBy: string;  
  tags?: string[];  
}

export interface UpdateQuestionInputDTO {
  id: string;             
  title?: string;
  description?: string;
  tags?: string[];
}

export interface QuestionListQueryDTO {
  page?: number;
  limit?: number;
  tag?: string;
  askedBy?: string;
  sortBy?: 'newest' | 'votes' | 'views';
}
