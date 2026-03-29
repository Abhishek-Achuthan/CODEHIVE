import { inject, injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import type { IBookSessionWithStripeUseCase } from '../../../application/useCase/interface/session/IBookSessionWithStripeUseCase';
import type { IBookSessionWithWalletUseCase } from '../../../application/useCase/interface/session/IBookSessionWithWalletUseCase';
import type { IGetBookedSessionsUseCase } from '../../../application/useCase/interface/session/IGetBookedSessionsUseCase';
import type { ICancelSessionUseCase } from '../../../application/useCase/interface/session/ICancelSessionUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';@injectable()
export class SessionController {
    constructor(
        @inject('IBookSessionWithStripeUseCase') private readonly _bookSessionWithStripe: IBookSessionWithStripeUseCase,
        @inject('IBookSessionWithWalletUseCase') private readonly _bookSessionWithWallet: IBookSessionWithWalletUseCase,
        @inject('IGetBookedSessionsUseCase') private readonly _getBookedSessions: IGetBookedSessionsUseCase,
        @inject('ICancelSessionUseCase') private readonly _cancelSession : ICancelSessionUseCase
    ) { }

    async handleBookSessionWithStripe(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.user;
            console.log(req.body);
            const result = await this._bookSessionWithStripe.execute({
                userId: id,
                ...req.body
            });
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async handleBookSessionWithWallet(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.user;
            console.log(req.body);
            const result = await this._bookSessionWithWallet.execute({
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

    async handleCancelSession(req:Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.user;
            const sessionId = req.params.id
            const result = await this._cancelSession.execute(sessionId!,id);
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
}
