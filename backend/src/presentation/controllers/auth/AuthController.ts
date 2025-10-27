import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import type { ISendOTPUseCase } from "../../../application/useCase/interface/auth/ISendOTPUseCase";
import type { IUserRegisterUseCase } from "../../../application/useCase/interface/auth/IUserRegisterUseCase";
import { RegisterUserSchema } from "../../validation/auth";
import { HttpStatus } from "../../../shared/httpStatusCode";
import { success } from "zod";

@injectable()
export class AuthController {
  constructor(
    @inject("IUserRegisterUseCase")
    private readonly _userRegisterUseCase: IUserRegisterUseCase,
    @inject("ISendOTPUseCase") private readonly _sendOTPUseCase: ISendOTPUseCase
  ) {}

  async handleUserRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const data = RegisterUserSchema.parse(req.body);

      const userRegisterd = await this._userRegisterUseCase.execute(data);

      console.log(userRegisterd);

      return res.status(HttpStatus.Created).json({success:true,message: 'User registered successfully'});

    } catch (error) {
      next(error);
    }
  }

  async handleSendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      
      const { email } = req.body;

      await this._sendOTPUseCase.execute(email);

      console.log(`OTP send successfully to ${email}`);

      return res.status(HttpStatus.OK).json({success:true,message: 'OTP send successfully'});
    } catch (error) {
      next(error);
    }
  }
}
