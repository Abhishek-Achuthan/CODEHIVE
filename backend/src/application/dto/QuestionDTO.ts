export interface IQuestionResponseDTO {
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

export interface ICreateQuestionInputDTO {
  title: string;
  description: string;
  askedBy: string;  
  tags?: string[];  
}

export interface IUpdateQuestionInputDTO {
  id: string;             
  title?: string;
  description?: string;
  tags?: string[];
}

export interface IQuestionListQueryDTO {
  page?: number;
  limit?: number;
  tag?: string;
  askedBy?: string;
  sortBy?: 'newest' | 'votes' | 'views';
}
