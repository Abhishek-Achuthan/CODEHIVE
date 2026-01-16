import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import type { IGetMyWalletUseCase } from '../../../application/useCase/interface/wallet/IGetMyWalletUseCase';

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
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
