import { Router } from 'express';
import { notificationController, authMiddleware } from '../../config/di/resolver';

export class NotificationRoute {
  private readonly _router: Router;
  private readonly _notificationController;

  constructor() {
    this._router = Router();
    this._notificationController = notificationController;
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.use(authMiddleware.check);

    this._router.get(
      '/',
      this._notificationController.getUserNotifications.bind(
        this._notificationController
      )
    );
    this._router.patch(
      '/read-all',
      this._notificationController.markAllAsRead.bind(
        this._notificationController
      )
    );
    this._router.patch(
      '/:id/read',
      this._notificationController.markAsRead.bind(
        this._notificationController
      )
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
