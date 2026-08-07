import { injectable, inject } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import { type IListMentorsUseCase } from '../../../application/useCase/interface/mentor/IListMentorsUseCase';
import { type IGetMentorAvailabilityUseCase } from '../../../application/useCase/interface/mentor/IGetMentorAvailabilityUseCase';
import { type ICreateMentorAvailabilityUseCase } from '../../../application/useCase/interface/mentor/ICreateMentorAvailabilityUseCase';
import { type IGetAvailableSlotsUseCase } from '../../../application/useCase/interface/session/IGetAvailableSlotsUseCase';
import { type IDeleteMentorAvailabilityUseCase } from '../../../application/useCase/interface/mentor/IDeleteMentorAvailabilityUseCase';
import { type IAddAvailabilityExceptionUseCase } from '../../../application/useCase/interface/mentor/IAddAvailabilityExceptionUseCase';
import { type IViewMentorProfileUseCase } from '../../../application/useCase/interface/mentor/IViewMentorProfileUseCase';
import { type IGetMentorInsightsUseCase } from '../../../application/useCase/interface/session/IGetMentorInsightsUseCase';
import { type IGetMentorReviewsUseCase } from '../../../application/useCase/interface/session/IGetMentorReviewsUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessage';
import {
  MentorListQuerySchema,
  MentorIdParamSchema,
  AvailabilityIdParamSchema,
  GetAvailableSlotsQuerySchema,
  AddExceptionBodySchema,
} from '../../validation/mentorValidations';

@injectable()
export class MentorController {
  constructor(
    @inject('IListMentorsUseCase')
    private readonly _listMentors: IListMentorsUseCase,
    @inject('ICreateMentorAvailabilityUseCase')
    private readonly _createAvailability: ICreateMentorAvailabilityUseCase,
    @inject('IGetAvailableSlotsUseCase')
    private readonly _getAvailableSlots: IGetAvailableSlotsUseCase,
    @inject('IGetMentorAvailabilityUseCase')
    private readonly _getAvailability: IGetMentorAvailabilityUseCase,
    @inject('IDeleteMentorAvailabilityUseCase')
    private readonly _deleteAvailability: IDeleteMentorAvailabilityUseCase,
    @inject('IAddAvailabilityExceptionUseCase')
    private readonly _addException: IAddAvailabilityExceptionUseCase,
    @inject('IViewMentorProfileUseCase')
    private readonly _viewMentorProfile: IViewMentorProfileUseCase,
    @inject('IGetMentorInsightsUseCase')
    private readonly _getInsights: IGetMentorInsightsUseCase,
    @inject('IGetMentorReviewsUseCase')
    private readonly _getReviews: IGetMentorReviewsUseCase
  ) { }

  async handleListMentors(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const params = MentorListQuerySchema.parse(req.query);

      const result = await this._listMentors.execute(params, userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleGetAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { mentorId } = MentorIdParamSchema.parse(req.params);

      const result = await this._getAvailability.execute(mentorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleGetAvailableSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { mentorId } = MentorIdParamSchema.parse(req.params);
      const { date } = GetAvailableSlotsQuerySchema.parse(req.query);

      const result = await this._getAvailableSlots.execute(mentorId, date);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleSetAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const result = await this._createAvailability.execute({
        mentorId: id,
        ...req.body,
      });
      res.status(HttpStatus.Created).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleGetMyAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const result = await this._getAvailability.execute(id);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: mentorId } = req.user;
      const { id: availabilityId } = AvailabilityIdParamSchema.parse(req.params);

      const result = await this._deleteAvailability.execute(availabilityId, mentorId);
      res.status(HttpStatus.OK).json({
        message: RESPONSE_MESSAGES.MENTOR.AVAILABILITY_RULE_DELETED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleAddException(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: mentorId } = req.user;
      const { id: availabilityId } = AvailabilityIdParamSchema.parse(req.params);
      const { date } = AddExceptionBodySchema.parse(req.body);

      const result = await this._addException.execute(availabilityId, mentorId, date);
      res.status(HttpStatus.OK).json({
        message: RESPONSE_MESSAGES.MENTOR.EXCEPTION_DATE_ADDED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleViewMentorProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { mentorId } = req.params;
      const result = await this._viewMentorProfile.execute(mentorId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleGetMyInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const result = await this._getInsights.execute(id);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleGetMyReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      
      const result = await this._getReviews.execute(id, page, limit);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
