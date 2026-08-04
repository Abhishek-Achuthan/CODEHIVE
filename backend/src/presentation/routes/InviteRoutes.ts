import { Router } from 'express';
import { authMiddleware, inviteController } from '../../config/di/resolver';

export class InviteRoutes {
  private readonly _router: Router;
  private readonly _inviteController;
  private readonly _authMiddleware;

  constructor() {
    this._router = Router();
    this._inviteController = inviteController;
    this._authMiddleware = authMiddleware;
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get(
      '/:code',
      this._authMiddleware.check,
      this._inviteController.handlePreviewInvite.bind(this._inviteController),
    );

    this._router.post(
      '/:code/join',
      this._authMiddleware.check,
      this._inviteController.handleJoinViaInvite.bind(this._inviteController),
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
