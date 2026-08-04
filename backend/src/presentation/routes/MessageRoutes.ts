import { Router } from 'express';
import { authMiddleware, messageController } from '../../config/di/resolver';

export class MessageRoutes {
  private readonly _router: Router;
  private readonly _messageController;
  private readonly _authMiddleware;

  constructor() {
    this._router = Router({ mergeParams: true });
    this._messageController = messageController;
    this._authMiddleware = authMiddleware;
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      '/',
      this._authMiddleware.check,
      this._messageController.handleCreateMessage.bind(this._messageController),
    );

    this._router.patch(
      '/:messageId',
      this._authMiddleware.check,
      this._messageController.handleEditMessage.bind(this._messageController),
    );

    this._router.delete(
      '/:messageId',
      this._authMiddleware.check,
      this._messageController.handleDeleteMessage.bind(this._messageController),
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
