// Request DTOs
import type { UserLanguage } from "../domain/language.types";
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

export type changePasswordData = {
  previousPass: string,
  newPass: string,
}

// Response DTOs
export type ExperienceApi = {
  id: string;
  type: "job" | "freelance" | "open_source" | "teaching" | "self_learning";
  title: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
};

export interface UserApi {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  avatarUrl?: string;
  about?: string;
  skills?: string[];
  languages?: UserLanguage[];
  experience?: ExperienceApi[];
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  mentorStatus?: "none" | "pending" | "approved";
  mentorAppliedAt?: string;
  primaryExpertise?: string;
  experienceLevel?: string;
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
