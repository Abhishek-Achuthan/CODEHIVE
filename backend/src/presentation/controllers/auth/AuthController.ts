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
import type { IChangePasswordUseCase } from '../../../application/useCase/interface/auth/IChangePasswordUseCase';
import type { ISetPasswordUseCase } from '../../../application/useCase/interface/auth/ISetPasswordUseCase';
import {
  LoginUserSchema,
  RegisterUserSchema,
  EmailOnlySchema,
  ForgotPasswordVerifySchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  SetPasswordSchema,
} from '../../validation/auth';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessage';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

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
    private readonly _initiateGithubOAuthUseCase: IInitiateGithubOAuthUseCase,
    @inject('IChangePasswordUseCase') 
    private readonly _changePasswordUseCase: IChangePasswordUseCase,
    @inject('ISetPasswordUseCase')
    private readonly _setPasswordUseCase: ISetPasswordUseCase
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
        .json({ success: true, message: RESPONSE_MESSAGES.AUTH.REGISTER_SUCCESS });
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
        .json({ success: true, message: RESPONSE_MESSAGES.AUTH.OTP_SENT });
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
        message: RESPONSE_MESSAGES.AUTH.LOGIN_SUCCESS,
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
        message: RESPONSE_MESSAGES.AUTH.OTP_SENT,
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
        message: RESPONSE_MESSAGES.AUTH.OTP_VERIFIED,
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
        .json({ success: true, message: RESPONSE_MESSAGES.AUTH.PASSWORD_RESET });
    } catch (error) {
      next(error);
    }
  }

  async handleChangePassword(req: Request,res: Response,next: NextFunction) {
    try {
      const parsedData = ChangePasswordSchema.parse(req.body);

      const {previousPass,newPass} = parsedData;

      const userId = req.user.id;
      
      await this._changePasswordUseCase.execute(previousPass,newPass,userId);

      return res.status(HttpStatus.OK).json({message: RESPONSE_MESSAGES.AUTH.PASSWORD_CHANGED});
    } catch (error) {
      next(error);
    }
  }

  async handleSetPassword(req: Request,res: Response,next: NextFunction) {
    try {
      const parsedData = SetPasswordSchema.parse(req.body);

      const { newPass } = parsedData;

      const userId = req.user.id;
      
      await this._setPasswordUseCase.execute(newPass, userId);

      return res.status(HttpStatus.OK).json({message: RESPONSE_MESSAGES.AUTH.PASSWORD_SET});
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
          .json({ success: false, message: ERROR_MESSAGES.AUTH.MISSING_REFRESH_TOKEN });
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

      const { accessToken, refreshToken, ...userData } = data;

      if (refreshToken) setCookie(res, refreshToken, 'refreshToken');

      return res.status(HttpStatus.OK).json({
        success: true,
        data: { user: userData, accessToken: accessToken },
        message: RESPONSE_MESSAGES.AUTH.LOGIN_SUCCESS,
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
          message: ERROR_MESSAGES.AUTH.MISSING_OR_INVALID_AUTH_CODE,
        });
      }

      const data = await this._githubLoginUseCase.execute(code);

      const { accessToken, refreshToken, ...userData } = data;

      if (refreshToken) setCookie(res, refreshToken, 'refreshToken');

      setAccessibleCookie(res, accessToken, 'accessToken');

      const frontendUrl = process.env.FRONTEND_URL
      
      const encodedUserData = encodeURIComponent(JSON.stringify(userData));

      const redirectUrl = `${frontendUrl}/auth/callback?user=${encodedUserData}`;
      
      return res.redirect(redirectUrl);

    } catch (error) {
      next(error);
    }
  }
}
