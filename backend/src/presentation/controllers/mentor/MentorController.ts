import { injectable, inject } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import { type IListMentorsUseCase } from '../../../application/useCase/interface/session/IListMentorsUseCase';
import { type IGetMentorAvailabilityUseCase } from '../../../application/useCase/interface/session/IGetMentorAvailabilityUseCase';
import { type ICreateMentorAvailabilityUseCase } from '../../../application/useCase/interface/session/ICreateMentorAvailabilityUseCase';
import { type IGetAvailableSlotsUseCase } from '../../../application/useCase/interface/session/IGetAvailableSlotsUseCase';
import { BadRequestError } from '../../../core/errors/BadRequestError';

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
    private readonly _getAvailability: IGetMentorAvailabilityUseCase
  ) {}

  async handleListMentors(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page, limit } = req.query;
      const params: { search?: string; page?: number; limit?: number } = {};

      if (search) params.search = String(search);
      if (page) params.page = Number(page);
      if (limit) params.limit = Number(limit);

      const result = await this._listMentors.execute(params);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleGetAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { mentorId } = req.params;

      const result = await this._getAvailability.execute(mentorId!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleGetAvailableSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { mentorId } = req.params;
      const date = typeof req.query.date === 'string' ? req.query.date : undefined;
      if (!date) throw new BadRequestError('date query param is required (YYYY-MM-DD)');

      const result = await this._getAvailableSlots.execute(mentorId!, date);
      res.status(200).json(result);
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
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
