import { Router } from "express";
import { authController } from "../../config/di/resolver";

export class AuthRoute {
  private readonly _router: Router;
  private readonly _authController;

  constructor() {
    this._router = Router();
    this._authController = authController;
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      "/users",
      this._authController.handleUserRegisterWithVerifyOtp.bind(
        this._authController
      )
    );
    this._router.post(
      "/otps",
      this._authController.handleSendOtp.bind(this._authController)
    );
    this._router.post(
      "/sessions",
      this._authController.handleUserLogin.bind(this._authController)
    );
    this._router.post(
      "/forgot-password",
      this._authController.handleForgotPasswordSendOtp.bind(
        this._authController
      )
    );
    this._router.post(
      "/forgot-password/verify-otp",
      this._authController.handleForgotPasswordVerifyOtp.bind(
        this._authController
      )
    );
    this._router.post(
      "/reset-password",
      this._authController.handleResetPassword.bind(this._authController)
    );
  }

  public getRoutes(): Router {
    return this._router;
  }
}
