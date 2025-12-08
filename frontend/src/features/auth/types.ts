import type { Path } from "react-hook-form";
import type { AxiosResponse } from "axios";
import type { RegisterData, LoginData, OTPData, SendOTPResponse } from "../../shared/types/api/auth";

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
  registerUrl?: string | undefined;
  forgotPasswordUrl?: string | undefined;
  className?: string;
  isLoading?: boolean;
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

