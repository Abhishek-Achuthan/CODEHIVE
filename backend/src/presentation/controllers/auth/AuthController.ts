import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import type { ISendOTPUseCase } from "../../../application/useCase/interface/auth/ISendOTPUseCase";
import type { IUserRegisterUseCase } from "../../../application/useCase/interface/auth/IUserRegisterUseCase";
import { LoginUserSchema, RegisterUserSchema } from "../../validation/auth";
import { HttpStatus } from "../../../shared/httpStatusCode";
import type { IVerifyOTPUseCase } from "../../../application/useCase/interface/auth/IVerifyOTPUseCase";
import type { IUserLoginUseCase } from "../../../application/useCase/interface/auth/IUserLoginUseCase";
import { success } from "zod";

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
    private readonly _userLoginUseCase: IUserLoginUseCase
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

      const parsedData = LoginUserSchema.parse(req.body)

      const data = await this._userLoginUseCase.execute(parsedData);

      console.log(data)

      return res
        .status(HttpStatus.OK)
        .json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
