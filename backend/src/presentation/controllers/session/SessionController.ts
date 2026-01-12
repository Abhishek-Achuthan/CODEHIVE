import { inject, injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import type { IBookSessionUseCase } from '../../../application/useCase/interface/session/IBookSessionUseCase';
import type { IGetBookedSessionsUseCase } from '../../../application/useCase/interface/session/IGetBookedSessionsUseCase';

@injectable()
export class SessionController {
    constructor(
        @inject('IBookSessionUseCase') private readonly _bookSession: IBookSessionUseCase,
        @inject('IGetBookedSessionsUseCase') private readonly _getBookedSessions: IGetBookedSessionsUseCase,
    ) { }


    async handleBookSession(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.user;
            console.log(req.body);
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
