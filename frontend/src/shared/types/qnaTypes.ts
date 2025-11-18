export type questionList = {
  filter?:QuestionListFilter
  page?: number;
  limit?: number;
  tag?: string;
  sortBy?: QuestionSort
  search?:string;
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

