import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import type { ISendOTPUseCase } from "../../../application/useCase/interface/auth/ISendOTPUseCase";
import type { IUserRegisterUseCase } from "../../../application/useCase/interface/auth/IUserRegisterUseCase";
import { LoginUserSchema, RegisterUserSchema } from "../../validation/auth";
import { HttpStatus } from "../../../shared/httpStatusCode";
import type { IVerifyOTPUseCase } from "../../../application/useCase/interface/auth/IVerifyOTPUseCase";
import type { IUserLoginUseCase } from "../../../application/useCase/interface/auth/IUserLoginUseCase";
import { setCookie } from "../../utils/cookieHelper";
import type { IForgotPasswordSendOTPUseCase } from "../../../application/useCase/interface/auth/IForgotPasswordSendOTPUseCase";
import type { IForgotPasswordVerifyOTPUseCase } from "../../../application/useCase/interface/auth/IForgotPasswordVerifyOTPUseCase";
import type { IResetPasswordUseCase } from "../../../application/useCase/interface/auth/IResetPasswordUseCase";

@injectable()
export class AuthController {
  constructor(
    @inject("IUserRegisterUseCase")
    private readonly _userRegisterUseCase: IUserRegisterUseCase,
    @inject("ISendOTPUseCase")
    private readonly _sendOTPUseCase: ISendOTPUseCase,
    @inject("IVerifyOTPUseCase")
    private readonly _verifyOTPUseCase: IVerifyOTPUseCase,
    @inject("IUserLoginUseCase")
    private readonly _userLoginUseCase: IUserLoginUseCase,
    @inject("IForgotPasswordSendOTPUseCase")
    private readonly _forgotPasswordSendOtpUseCase: IForgotPasswordSendOTPUseCase,
    @inject("IForgotPasswordVerifyOTPUseCase")
    private readonly _forgotPasswordVerifyOtpUseCase: IForgotPasswordVerifyOTPUseCase,
    @inject("IResetPasswordUseCase")
    private readonly _resetPassword: IResetPasswordUseCase
  ) {}

  async handleUserRegisterWithVerifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { data, otp } = req.body;

      const parsedData = RegisterUserSchema.parse(data);

      const verified = await this._verifyOTPUseCase.execute(
        parsedData.email,
        otp
      );

      if (verified) await this._userRegisterUseCase.execute(parsedData);

      return res
        .status(HttpStatus.Created)
        .json({ success: true, message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  async handleSendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      await this._sendOTPUseCase.execute(email);

      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "OTP send successfully" });
    } catch (error) {
      next(error);
    }
  }

  async handleUserLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = LoginUserSchema.parse(req.body);

      const data = await this._userLoginUseCase.execute(parsedData);

      const { accessToken, refreshToken, ...userData } = data;

      if (refreshToken) setCookie(res, refreshToken, "refreshToken");

      return res.status(HttpStatus.OK).json({
        success: true,
        data: { user: userData, accessToken: accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async handleForgotPasswordSendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;

      await this._forgotPasswordSendOtpUseCase.execute(email);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "OTP send successfully to your email!",
      });
    } catch (error) {
      next(error);
    }
  }

  async handleForgotPasswordVerifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { otp, email } = req.body;

      const verified = await this._forgotPasswordVerifyOtpUseCase.execute(
        otp,
        email
      );

      return res
        .status(HttpStatus.OK)
        .json({
          success: true,
          verified,
          message: "OTP verified successfully",
        });
    } catch (error) {
      next(error);
    }
  }

  async handleResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, email } = req.body;

      await this._resetPassword.execute(email, password);

      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  }
}
