import { inject, injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { removeCookie, setCookie, setAccessibleCookie } from '../../utils/cookieHelper';
import { HttpStatus } from '../../../shared/httpStatusCode';
import type { ISendOTPUseCase } from '../../../application/useCase/interface/auth/ISendOTPUseCase';
import type { IUserRegisterUseCase } from '../../../application/useCase/interface/auth/IUserRegisterUseCase';
import type { IVerifyOTPUseCase } from '../../../application/useCase/interface/auth/IVerifyOTPUseCase';
import type { IUserLoginUseCase } from '../../../application/useCase/interface/auth/IUserLoginUseCase';
import type { IForgotPasswordSendOTPUseCase } from '../../../application/useCase/interface/auth/IForgotPasswordSendOTPUseCase';
import type { IForgotPasswordVerifyOTPUseCase } from '../../../application/useCase/interface/auth/IForgotPasswordVerifyOTPUseCase';
import type { IResetPasswordUseCase } from '../../../application/useCase/interface/auth/IResetPasswordUseCase';
import type { IUserLogoutUseCase } from '../../../application/useCase/interface/auth/IUserLogoutUseCase';
import type { IRefreshAccessTokenUseCase } from '../../../application/useCase/interface/auth/IRefreshAccessTokenUseCase';
import type { IGoogleLoginUseCase } from '../../../application/useCase/interface/auth/IGoogleLoginUseCase';
import type { IGithubLoginUseCase } from '../../../application/useCase/interface/auth/IGithubLoginUseCase';
import type { IInitiateGithubOAuthUseCase } from '../../../application/useCase/interface/auth/IInitiateGithubOAuthUseCase';
import {
  LoginUserSchema,
  RegisterUserSchema,
  EmailOnlySchema,
  ForgotPasswordVerifySchema,
  ResetPasswordSchema,
} from '../../validation/auth';

@injectable()
export class AuthController {
  constructor(
    @inject('IUserRegisterUseCase')
    private readonly _userRegisterUseCase: IUserRegisterUseCase,
    @inject('ISendOTPUseCase')
    private readonly _sendOTPUseCase: ISendOTPUseCase,
    @inject('IVerifyOTPUseCase')
    private readonly _verifyOTPUseCase: IVerifyOTPUseCase,
    @inject('IUserLoginUseCase')
    private readonly _userLoginUseCase: IUserLoginUseCase,
    @inject('IForgotPasswordSendOTPUseCase')
    private readonly _forgotPasswordSendOtpUseCase: IForgotPasswordSendOTPUseCase,
    @inject('IForgotPasswordVerifyOTPUseCase')
    private readonly _forgotPasswordVerifyOtpUseCase: IForgotPasswordVerifyOTPUseCase,
    @inject('IResetPasswordUseCase')
    private readonly _resetPassword: IResetPasswordUseCase,
    @inject('IUserLogoutUseCase')
    private readonly _userLogoutUseCase: IUserLogoutUseCase,
    @inject('IRefreshAccessTokenUseCase')
    private readonly _refreshAccessTokenUseCase: IRefreshAccessTokenUseCase,
    @inject('IGoogleLoginUseCase')
    private readonly _googleLoginUseCase: IGoogleLoginUseCase,
    @inject('IGithubLoginUseCase')
    private readonly _githubLoginUseCase: IGithubLoginUseCase,
    @inject('IInitiateGithubOAuthUseCase')
    private readonly _initiateGithubOAuthUseCase: IInitiateGithubOAuthUseCase
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
        .json({ success: true, message: 'User registered successfully' });
    } catch (error) {
      next(error);
    }
  }

  async handleSendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = EmailOnlySchema.parse(req.body);

      await this._sendOTPUseCase.execute(email);

      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: 'OTP send successfully' });
    } catch (error) {
      next(error);
    }
  }

  async handleUserLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = LoginUserSchema.parse(req.body);

      const data = await this._userLoginUseCase.execute(parsedData);

      const { accessToken, refreshToken, ...userData } = data;

      if (refreshToken) setCookie(res, refreshToken, 'refreshToken');

      return res.status(HttpStatus.OK).json({
        success: true,
        data: { user: userData, accessToken: accessToken },
        message: 'Login successfull',
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
      const { email } = EmailOnlySchema.parse(req.body);

      await this._forgotPasswordSendOtpUseCase.execute(email);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'OTP send successfully to your email!',
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
      const { otp, email } = ForgotPasswordVerifySchema.parse(req.body);

      const verified = await this._forgotPasswordVerifyOtpUseCase.execute(
        otp,
        email
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        verified,
        message: 'OTP verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async handleResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, email } = ResetPasswordSchema.parse(req.body);

      await this._resetPassword.execute(email, password);

      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }

  async handleUserLogout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken;

      if (token) await this._userLogoutUseCase.execute(token);

      removeCookie(res, 'refreshToken');

      return res.status(HttpStatus.NoContent).send();
    } catch (error) {
      next(error);
    }
  }

  async handleRefreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const refreshToken = req.cookies.refreshToken as string | undefined;
      if (!refreshToken) {
        return res
          .status(HttpStatus.Forbidden)
          .json({ success: false, message: 'Missing refresh token' });
      }

      const accessToken = await this._refreshAccessTokenUseCase.execute(
        refreshToken
      );

      return res.status(HttpStatus.OK).json({ access_token: accessToken });
    } catch (error) {
      next(error);
    }
  }

  async hanldGoogleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const authCode = req.body.code;

      const data = await this._googleLoginUseCase.execute(authCode);

      const { accessToken, refreshToken, user } = data;

      if (refreshToken) setCookie(res, refreshToken, 'refreshToken');

      return res.status(HttpStatus.OK).json({
        success: true,
        data: { user, accessToken: accessToken },
        message: 'Login successfull',
      });
    } catch (error) {
      next(error);
    }
  }

  async initiateGithubOAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const githubAuthUrl = this._initiateGithubOAuthUseCase.execute();
      
      return res.redirect(githubAuthUrl);
    } catch (error) {
      next(error);
    }
  }

  async handleGithubCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        return res.status(HttpStatus.BadRequest).json({
          success: false,
          message: 'Missing or invalid authorization code',
        });
      }

      const data = await this._githubLoginUseCase.execute(code);

      const { accessToken, refreshToken, user } = data;

      if (refreshToken) setCookie(res, refreshToken, 'refreshToken');

      setAccessibleCookie(res, accessToken, 'accessToken');

      const frontendUrl = process.env.FRONTEND_URL
      
      const userData = encodeURIComponent(JSON.stringify(user));

      const redirectUrl = `${frontendUrl}/auth/callback?user=${userData}`;
      
      return res.redirect(redirectUrl);

    } catch (error) {
      next(error);
    }
  }
}
