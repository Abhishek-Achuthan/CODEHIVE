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
  descriptionHtml:string,
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


  export type CreateQuestion = {
    title:string,
    descriptionHtml:string,
    askedBy:string,
    tags:string[],
  }

