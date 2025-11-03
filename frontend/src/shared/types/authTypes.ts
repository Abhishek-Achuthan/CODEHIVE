import type { Path } from "react-hook-form";
import type { User } from "./userTypes";
import type { AxiosResponse } from "axios";

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

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface FieldComponentProps {
  id: string;
  name: string;
  placeholder: string;
  type?: "text" | "email" | "tel" | "password";
  value?: string;
  onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  onBlur: React.FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  className?: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginData) => Promise<void>;
  registerUrl?: string;
  forgotPasswordUrl?: string;
  className?: string;
}

export interface SignUpFormProps {
  fields?: Array<{
    name: keyof RegisterData;
    label: string;
    placeholder: string;
    type?: "text" | "email" | "tel" | "password";
    component?: React.ComponentType<FieldComponentProps>;
  }>;
  sendOTP?: (data: OTPData) => Promise<AxiosResponse<SendOTPResponse>>;
  showOAuth?: boolean;
  loginUrl?: string;
  className?: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface FormFieldProps<T> {
  field: {
    name: Path<T>;
    label: string;
    placeholder: string;
    type?: "text" | "email" | "tel" | "password";
    component?: React.ComponentType<FieldComponentProps>;
  };
}

export interface ForgotPasswordFormProps {
  loginUrl?: string;
  className?: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}
