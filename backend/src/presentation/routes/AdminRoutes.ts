import { Router } from "express";
import { adminController, authMiddleware } from "../../config/di/resolver";

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
      "/users",
      authMiddleware.check,
      this._adminController.handleListUsers.bind(this._adminController)
    );
    this._router.patch(
      "/update-user-status",
      authMiddleware.check,
      this._adminController.handleUpdateUserStatus.bind(this._adminController)
    );
  }

  public getRoutes():Router {
    return this._router;
  }
}

