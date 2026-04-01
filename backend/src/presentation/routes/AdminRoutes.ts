import { Router } from 'express';
import { adminController, authMiddleware, roleMiddleware } from '../../config/di/resolver';
import { UserRole } from '../../domain/types/UserRole';

export class AdminRoute {
  private _router: Router;
  private _adminController;

  constructor() {
    this._router = Router();
    this._adminController = adminController;
    this.setRoutes();
  }

  private setRoutes() {
    this._router.get(
      '/users',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._adminController.handleListUsers.bind(this._adminController)
    );
    this._router.patch(
      '/update-user-status',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._adminController.handleUpdateUserStatus.bind(this._adminController)
    );
    this._router.get(
      '/list-applications',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._adminController.handleListMentorApplications.bind(this._adminController)
    );
    this._router.patch(
      '/update-mentor-status',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._adminController.handleUpdateMentorStatus.bind(this._adminController)
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
