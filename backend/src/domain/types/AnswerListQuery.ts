import { AnswerSort } from './AnswerSort';
import { ListQuery } from './ListQuery';

export type AnswerListQuery = Omit <ListQuery<never,AnswerSort>,'filter'>;