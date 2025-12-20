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
export interface UserApi {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: UserApi;
  accessToken: string;
  refreshToken?: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
}
