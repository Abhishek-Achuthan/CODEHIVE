import { AxiosError } from "axios";
import toast from "react-hot-toast";

import * as AuthApi from "../api/endpoints/authAPI";
import type * as AuthType from "../shared/types/authTypes";

export class AuthService {
  static async register(otp: string, data: AuthType.RegisterData) {
    try {
      const response = await AuthApi.registerUser(otp, data);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      this.handleError(error); 
    }
  }

  static async login(data: AuthType.LoginData) {
    try {
      const response = await AuthApi.userLogin(data);
      toast.success("Login successfull");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async sendOtp(data: AuthType.OTPData) {
    try {
      const response = await AuthApi.sendOTP(data);
      console.log(response)
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      if(error instanceof AxiosError)throw error
      // this.handleError(error);
    }
  }

  static async resendOtp(id: string) {
    try {
      const response = await AuthApi.resendOTP(id);
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async forgotPasswordSendOtp(data: AuthType.ForgotPasswordData) {
    try {
      const response = await AuthApi.forgotPasswordSendOtp(data);
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async forgotPasswordVerifyOtp(otp: string, email: string) {
    try {
      const response = await AuthApi.forgotPasswordVerifyOtp(otp, email);
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async resetPassword(data: AuthType.ResetPasswordData) {
    try {
      const response = await AuthApi.resetPassword(data);
      toast.success(response.data?.message);
    } catch (error) {
      this.handleError(error);
    }
  }

  static async logout() {
    try {
      await AuthApi.userLogout()
      toast.success("Logout successfully")
    } catch (error) {
      this.handleError(error);
    }
  }

  static async googleLogin(idToken:string) {
    try {
      const response = await AuthApi.googleLogin(idToken);

      toast.success(response.data.message);
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
      toast.error(error.response?.data?.message || "Something went wrong");
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Unexpected error");
    }
    throw error;
  }
}
