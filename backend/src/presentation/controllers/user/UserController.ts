import { inject, injectable } from 'tsyringe';
import { type IUpdateUserProfileUseCase } from '../../../application/useCase/interface/user/IUpdateUserProfileUseCase';
import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { z } from 'zod';

const ABOUT_MAX_CHARS = 200;
const SKILL_MAX_CHARS = 40;
const SKILLS_MAX_ITEMS = 50;

const YEAR_MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

const SkillSchema = z
  .string()
  .max(SKILL_MAX_CHARS)
  .transform((val) => val.replace(/\s+/g, ' ').trim())
  .refine((val) => val.length > 0, { message: 'Skill cannot be empty' });

const YearMonthSchema = z.preprocess(
  (val) => {
    if (typeof val !== 'string') return val;
    const trimmed = val.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  },
  z.string().regex(YEAR_MONTH_REGEX)
);

const ExperienceItemSchema = z
  .object({
    id: z.string(),
    type: z.enum(['job', 'freelance', 'open_source', 'teaching', 'self_learning']),
    title: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length > 0, { message: 'Title is required' }),
    organization: z.string().optional(),
    startDate: YearMonthSchema.optional(),
    endDate: YearMonthSchema.optional(),
    isCurrent: z.boolean().optional(),
  })
  .superRefine((item, ctx) => {
    if (item.isCurrent && item.endDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date must be empty for current experience',
      });
    }

    if (!item.isCurrent && item.startDate && item.endDate && item.endDate < item.startDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be before start date',
      });
    }
  });

const UpdateUserProfileSchema = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().min(6).optional(),
    about: z
      .string()
      .max(ABOUT_MAX_CHARS)
      .transform((val) => val.replace(/\s+/g, ' ').trim())
      .optional(),
    skills: z.array(SkillSchema).max(SKILLS_MAX_ITEMS).optional(),
    experience: z
      .array(
        ExperienceItemSchema
      )
      .optional(),
    avatarUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    linkedInUrl: z.string().optional(),
    websiteUrl: z.string().optional(),
  })
  .strict();

@injectable()
export class UserController {
  constructor(
    @inject('IUpdateUserProfileUseCase')
    private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase
  ) {}

  async handleUpdateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = UpdateUserProfileSchema.parse(req.body);
      const userId = req.user.id;

      const updatedProfile = await this._updateUserProfileUseCase.execute(
        data,
        userId
      );

      console.log(updatedProfile)

      res.status(HttpStatus.OK).json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }
}
