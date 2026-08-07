import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import type { IGetMyWalletUseCase } from '../../../application/useCase/interface/wallet/IGetMyWalletUseCase';
import type { IGetWalletTransactionsUseCase } from '../../../application/useCase/interface/wallet/IGetWalletTransactionsUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';

@injectable()
export class WalletController {
  constructor(
    @inject('IGetMyWalletUseCase')
    private readonly _getMyWallet: IGetMyWalletUseCase,
    @inject('IGetWalletTransactionsUseCase')
    private readonly _getWalletTransactions: IGetWalletTransactionsUseCase
  ) {}

  async handleGetMyWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const result = await this._getMyWallet.execute(id);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleGetWalletTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      
      const result = await this._getWalletTransactions.execute(id, page, limit);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
