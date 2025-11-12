import { AxiosError } from "axios";

import * as AuthApi from "../api/endpoints/authAPI";
import type * as AuthType from "../shared/types/authTypes";

import { BaseError } from "../shared/errors/BaseError";

export class AuthService {
  static async register(otp: string, data: AuthType.RegisterData) {
    try {
      const response = await AuthApi.registerUser(otp, data);
      return response.data;
    } catch (error) {
      this.handleError(error); 
    }
  }

  static async login(data: AuthType.LoginData) {
    try {
      const response = await AuthApi.userLogin(data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async sendOtp(data: AuthType.OTPData) {
    try {
      const response = await AuthApi.sendOTP(data);
      return response
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  static async resendOtp(id: string) {
    try {
      const response = await AuthApi.resendOTP(id);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async forgotPasswordSendOtp(data: AuthType.ForgotPasswordData) {
    try {
      const response = await AuthApi.forgotPasswordSendOtp(data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async forgotPasswordVerifyOtp(otp: string, email: string) {
    try {
      const response = await AuthApi.forgotPasswordVerifyOtp(otp, email);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async resetPassword(data: AuthType.ResetPasswordData) {
    try {
      const response = await AuthApi.resetPassword(data);
      return response.data
    } catch (error) {
      this.handleError(error);
    }
  }

  static async logout() {
    try {
      await AuthApi.userLogout()
    } catch (error) {
      this.handleError(error);
    }
  }

  static async googleLogin(idToken:string) {
    try {
      const response = await AuthApi.googleLogin(idToken);
      return response.data;
    } catch (error) {
      this.handleError(error)
    }
  }

  static initiateGithubOAuth() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`;
  }

  private static handleError(error: unknown) {
    if (error instanceof AxiosError) {
      const msg = error.response?.data?.message || 'Something went wrong';
      const status = error.response?.status;
      throw new BaseError(msg,status);
    }
    if(error instanceof Error) {
      throw new BaseError(error.message);
    } 
    throw new BaseError('Unexpected error');
  }
}
