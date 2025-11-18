import z from 'zod'
import { IQuestionListQueryDTO } from '../../application/dto/QuestionDTO';

export const QuestionListSchema = z.object({
  page: z.coerce.number().min(1).default(1), 
  limit: z.coerce.number().min(1).max(100).default(10), 
  sortBy: z.enum(['newest', 'oldest', 'most_answered','most_voted','most_viewed']).optional().default('newest'),
  search: z.string().optional(),
  tag: z.string().optional(),
  'filter.status': z.enum(['answered', 'unanswered', 'all']).optional(), 
  'filter.tags': z.string().transform((val) => val ? val.split(',').map(t => t.trim()).filter(Boolean) : []).optional(),
  'filter.dateFrom': z.string().optional(),
}).transform((raw) => { 
  const filter = {
    status: raw['filter.status'],
    tags: raw['filter.tags'],
    dateFrom: raw['filter.dateFrom'],
  };
  return {
    ...raw,
    filter: Object.fromEntries(Object.entries(filter).filter(([, v]) => v !== undefined)) || undefined,
  } as IQuestionListQueryDTO; 
});