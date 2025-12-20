import type { Path } from "react-hook-form";
import type { AxiosResponse } from "axios";

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
};

export type OtpRequestValues = {
  email: string;
};

export interface SendOtpResponse {
  success: boolean;
  message: string;
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
  onSubmit: (data: LoginFormValues) => Promise<void>;
  registerUrl?: string | undefined;
  forgotPasswordUrl?: string | undefined;
  className?: string;
  isLoading?: boolean;
}

export interface SignUpFormProps {
  fields?: Array<{
    name: keyof RegisterFormValues;
    label: string;
    placeholder: string;
    type?: "text" | "email" | "tel" | "password";
    component?: React.ComponentType<FieldComponentProps>;
  }>;
  sendOTP?: (data: OtpRequestValues) => Promise<AxiosResponse<SendOtpResponse>>;
  showOAuth?: boolean;
  loginUrl?: string;
  className?: string;
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

// Form data types
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

