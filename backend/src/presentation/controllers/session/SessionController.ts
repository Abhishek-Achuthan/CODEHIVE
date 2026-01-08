import { inject, injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import type { ICreateMentorAvailabilityUseCase } from '../../../application/useCase/interface/session/ICreateMentorAvailabilityUseCase';
import type { IGetMentorAvailabilityUseCase } from '../../../application/useCase/interface/session/IGetMentorAvailabilityUseCase';
import type { IBookSessionUseCase } from '../../../application/useCase/interface/session/IBookSessionUseCase';
import type { IGetBookedSessionsUseCase } from '../../../application/useCase/interface/session/IGetBookedSessionsUseCase';
import type { IListMentorsUseCase } from '../../../application/useCase/interface/session/IListMentorsUseCase';

@injectable()
export class SessionController {
    constructor(
        @inject('ICreateMentorAvailabilityUseCase') private readonly _createAvailability: ICreateMentorAvailabilityUseCase,
        @inject('IGetMentorAvailabilityUseCase') private readonly _getAvailability: IGetMentorAvailabilityUseCase,
        @inject('IBookSessionUseCase') private readonly _bookSession: IBookSessionUseCase,
        @inject('IGetBookedSessionsUseCase') private readonly _getBookedSessions: IGetBookedSessionsUseCase,
        @inject('IListMentorsUseCase') private readonly _listMentors: IListMentorsUseCase
    ) { }

    async handleSetAvailability(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.user;
            const result = await this._createAvailability.execute({
                mentorId: id,
                ...req.body
            });
            res.status(201).json(result);
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

    async handleBookSession(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.user;
            const result = await this._bookSession.execute({
                userId: id,
                ...req.body
            });
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async handleGetBookedSessions(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.user;
            const result = await this._getBookedSessions.execute(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
