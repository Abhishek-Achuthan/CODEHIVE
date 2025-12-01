import z from 'zod'
import { IQuestionListQueryDTO } from '../../application/dto/QuestionDTO';

export const QuestionListSchema = z.object({
  page: z.coerce.number().min(1).default(1), 
  limit: z.coerce.number().min(1).max(100).default(10), 
  sortBy: z.enum(['newest', 'oldest', 'most_answered','most_voted','most_viewed']).optional().default('newest'),
  search: z.string().optional(),
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

export const CreateQuestionSchema = z.object({
  title: z.string().min(10),
  descriptionHtml: z.string().min(10),
  askedBy: z.string(),
  tags: z.array(z.string()).optional(),
});

export const ValidIdSchema = z.object({
  questionId: z.string().refine(val => /^[0-9a-f]{24}$/i.test(val), { message: 'Invalid id' }),
}).transform((raw) => ({ questionId: raw.questionId }) as { questionId: string });

