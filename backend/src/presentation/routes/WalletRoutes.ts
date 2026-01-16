import { Router } from 'express';
import { authMiddleware, walletController } from '../../config/di/resolver';

export class WalletRoutes {
  private _router: Router;
  private _authMiddleware;
  private _walletController;

  constructor() {
    this._router = Router();
    this._authMiddleware = authMiddleware;
    this._walletController = walletController;
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get(
      '/me',
      this._authMiddleware.check,
      this._walletController.handleGetMyWallet.bind(this._walletController)
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
