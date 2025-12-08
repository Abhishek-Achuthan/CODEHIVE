import type { User } from "../domain/user";

// Request DTOs
export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type OTPData = {
  email: string;
};

export type ForgotPasswordData = {
  email: string;
};

export type ResetPasswordData = {
  email: string;
  password: string;
};

// Response DTOs
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
}
