import { QuestionStatus } from './QuestionStatus';

export interface QuestionListFilter {
  tags?: string[];                
  status?: QuestionStatus;
  bookmarkedOnly?: boolean;       
  dateFrom?: string;              
  minAnswers?: number;
  minVotes?: number;
  askedBy?: string; 
}