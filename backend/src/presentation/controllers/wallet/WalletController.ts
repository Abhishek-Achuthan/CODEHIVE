import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import type { IGetMyWalletUseCase } from '../../../application/useCase/interface/wallet/IGetMyWalletUseCase';
import { HttpStatus } from '../../../shared/httpStatusCode';

@injectable()
export class WalletController {
  constructor(
    @inject('IGetMyWalletUseCase')
    private readonly _getMyWallet: IGetMyWalletUseCase
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
}
