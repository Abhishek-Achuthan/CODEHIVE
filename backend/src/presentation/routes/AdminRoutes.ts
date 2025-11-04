import { Router } from "express";
import { adminController } from "../../config/di/resolver";

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
      this._adminController.handleListUsers.bind(this._adminController)
    );
    this._router.patch(
      "/update-user-status",this._adminController.handleUpdateUserStatus.bind(this._adminController)
    )
  }

  public getRoutes():Router {
    return this._router;
  }
}

