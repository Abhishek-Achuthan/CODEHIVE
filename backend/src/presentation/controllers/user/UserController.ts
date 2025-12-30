import { inject, injectable } from 'tsyringe';
import { type IUpdateUserProfileUseCase } from '../../../application/useCase/interface/user/IUpdateUserProfileUseCase';
import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { z } from 'zod';

const UpdateUserProfileSchema = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().min(6).optional(),
    about: z.string().optional(),
    skills: z.array(z.string()).optional(),
    experience: z
      .array(
        z.object({
          id: z.string(),
          type: z.enum(['job', 'freelance', 'open_source', 'teaching', 'self_learning']),
          title: z.string(),
          organization: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          isCurrent: z.boolean().optional(),
        })
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
