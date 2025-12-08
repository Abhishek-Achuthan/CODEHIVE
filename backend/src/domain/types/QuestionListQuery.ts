import { ListQuery } from './ListQuery';
import { QuestionListFilter } from './QuestionListFilter';
import { QuestionSort } from './QuestionSort';

export type QuestionListQuery = ListQuery<QuestionListFilter,QuestionSort>;