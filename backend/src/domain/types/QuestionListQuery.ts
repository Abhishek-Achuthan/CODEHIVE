import { QuestionListFilter } from './QuestionListFilter';
import { QuestionSort } from './QuestionSort';

export interface QuestionListQuery {
    filter?: QuestionListFilter;
    page?:number;
    limit?:number;
    sortBy?:QuestionSort;
    search?:string;
}