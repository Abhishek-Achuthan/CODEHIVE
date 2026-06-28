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
    this._router.get(
      '/reports',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._adminController.handleListReports.bind(this._adminController)
    );
    this._router.patch(
      '/reports/:id/status',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._adminController.handleUpdateReportStatus.bind(this._adminController)
    );
    this._router.get(
      '/reports/rooms/:roomId/chat-history',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._adminController.handleGetRoomChatHistory.bind(this._adminController)
    );
    this._router.patch(
      '/users/:userId/ban',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._adminController.handleBanUser.bind(this._adminController)
    );
    this._router.patch(
      '/users/:userId/unban',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._adminController.handleUnbanUser.bind(this._adminController)
    );
    this._router.patch(
      '/users/:userId/warn',
      authMiddleware.check,
      roleMiddleware.authorize([UserRole.ADMIN]),
      this._adminController.handleWarnUser.bind(this._adminController)
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
