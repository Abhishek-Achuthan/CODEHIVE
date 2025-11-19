export type questionList = {
  filter?:QuestionListFilter
  page?: number;
  tags?: string[];
  limit?: number;
  sortBy?: QuestionSort
  search?:string;
}

export type QuestionListAPIResponse = {
  id:string,
  title:string,
  description:string,
  tags:string[],
  votes:number,
  answerCount:number,
  views:number,
}

export interface QuestionListFilter {
  tags?: string[];                
  status?: QuestionStatus
  bookmarkedOnly?: boolean;       
  dateFrom?: string;              
}

export type QuestionStatus = 'all' | 'answered' | 'unanswered';

export type QuestionSort =
  | 'newest'
  | 'oldest'
  | 'most_answered'
  | 'least_answered'
  | 'most_viewed'
  | 'most_voted';

