import { inject, injectable } from 'tsyringe';
import { type IUpdateUserProfileUseCase } from '../../../application/useCase/interface/user/IUpdateUserProfileUseCase';
import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { UpdateUserProfileSchema } from '../../validation/userValidations';
import { type IApplyForMentorUseCase } from '../../../application/useCase/interface/user/IApplyForMentorUseCase';
import { type IGetUserActivityUseCase } from '../../../application/useCase/interface/user/IGetUserActivityUseCase';


@injectable()
export class UserController {
  constructor(
    @inject('IUpdateUserProfileUseCase')
    private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,
    @inject('IApplyForMentorUseCase')
    private readonly _applyForMentorUseCase: IApplyForMentorUseCase,
    @inject('IGetUserActivityUseCase')
    private readonly _getUserActivityUseCase: IGetUserActivityUseCase
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

  async handleApplyForMentor(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const data = await this._applyForMentorUseCase.execute(userId);

      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error)
    }
  }

  async handleGetMyActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const data = await this._getUserActivityUseCase.execute(userId);
      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  }
}
