import { z } from 'zod';
import { IQuestionListQueryDTO } from '../../application/dto/QuestionDTO';

const validateHtmlContent = (html: string, minPlainText: number, maxPlainText: number) => {
  const plainText = html.replace(/<[^>]*>/g, '').trim();
  const length = plainText.length;

  if (length < minPlainText) {
    return { valid: false, message: `Content must have at least ${minPlainText} characters of text (excluding HTML tags)` };
  }
  if (length > maxPlainText) {
    return { valid: false, message: `Content must not exceed ${maxPlainText} characters of text (excluding HTML tags)` };
  }
  return { valid: true };
};

export const QuestionListSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(['newest', 'oldest', 'most_answered', 'most_voted', 'most_viewed']).default('newest'),
  search: z.string()
    .max(200, 'Search query must not exceed 200 characters')
    .transform(val => val?.trim())
    .optional(),
  // keep raw query keys to parse incoming querystrings, but treat them as optional strings
  'filter.status': z.enum(['answered', 'unanswered', 'all']).optional(),
  'filter.tags': z.string().optional(),        // keep as raw CSV string here
  'filter.dateFrom': z.string().optional(),
}).transform((raw) => {
  // build typed filter object, only including provided fields
  const filter: Record<string, unknown> = {};

  if (raw['filter.status'] !== undefined) filter.status = raw['filter.status'];
  if (raw['filter.tags'] !== undefined && raw['filter.tags'].trim()) {
    const tags = raw['filter.tags']
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .filter(tag => tag.length <= 30); // Additional safety: max tag length
    if (tags.length) filter.tags = tags;
  }
  if (raw['filter.dateFrom'] !== undefined && raw['filter.dateFrom'].trim()) {
    filter.dateFrom = raw['filter.dateFrom'].trim();
  }

  // Return only the intended fields (avoid leaving dotted keys in result)
  return {
    page: raw.page,
    limit: raw.limit,
    sortBy: raw.sortBy,
    search: raw.search,
    filter: Object.keys(filter).length ? filter : undefined,
  } as IQuestionListQueryDTO;
});

export const CreateQuestionSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  descriptionHtml: z.string()
    .min(1, 'Description is required')
    .superRefine((html: string, ctx) => {
      const result = validateHtmlContent(html, 20, 50000);
      if (!result.valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.message || 'Invalid description content',
        });
      }
    }),
  askedBy: z.string()
    .refine(val => /^[0-9a-f]{24}$/i.test(val), { message: 'Invalid user ID' }),
  tags: z.array(z.string().min(1).max(30))
    .max(5, 'Maximum 5 tags allowed')
    .optional()
    .default([]),
});

export const ValidIdSchema = z.object({
  questionId: z.string().refine(val => /^[0-9a-f]{24}$/i.test(val), { message: 'Invalid id' }),
}).transform((raw) => ({ questionId: raw.questionId } as { questionId: string }));

export const PostAnswerSchema = z.object({
  questionId: z.string()
    .refine(val => /^[0-9a-f]{24}$/i.test(val), { message: 'Invalid question ID' }),
  answerText: z.string()
    .min(1, 'Answer text is required')
    .superRefine((html: string, ctx) => {
      const result = validateHtmlContent(html, 10, 50000);
      if (!result.valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.message || 'Invalid answer content',
        });
      }
    }),
});

export const SaveQuestionSchema = z.object({
  questionId: z.string().refine(val => /^[0-9a-f]{24}$/i.test(val), { message: 'Invalid id' }),
  userid: z.string().refine(val => /^[0-9a-f]{24}$/i.test(val), { message: 'Invalid userid' }),
}).transform((raw) => ({ questionId: raw.questionId, userid: raw.userid } as { questionId: string, userid: string }));

export const EditQuestionSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim()
    .optional(),
  descriptionHtml: z.string()
    .min(1, 'Description cannot be empty')
    .superRefine((html: string, ctx) => {
      const result = validateHtmlContent(html, 20, 50000);
      if (!result.valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.message || 'Invalid description content',
        });
      }
    })
    .optional(),
  tags: z.array(z.string().min(1).max(30))
    .max(5, 'Maximum 5 tags allowed')
    .optional(),
  version: z.number()
    .int('Version must be an integer')
    .min(1, 'Version must be at least 1'),
});

export const EditAnswerSchema = z.object({
  answerText: z.string()
    .min(1, 'Answer text is required')
    .superRefine((html: string, ctx) => {
      const result = validateHtmlContent(html, 10, 50000);
      if (!result.valid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.message || 'Invalid answer content',
        });
      }
    }),
  version: z.number()
    .int('Version must be an integer')
    .min(1, 'Version must be at least 1'),
  answerId: z.string()
    .refine(val => /^[0-9a-f]{24}$/i.test(val), { message: 'Invalid answer ID' })
    .optional(),
});