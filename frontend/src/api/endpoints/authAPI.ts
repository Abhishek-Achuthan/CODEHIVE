import apiClient from '../apiClient';
import type { ForgotPasswordData, LoginData, OTPData, RegisterData } from '../../shared/types/authTypes';
import { API_ROUTES } from '../../constants/apiRoutes';

export const registerUser = (otp:string,data:RegisterData) => apiClient.post(API_ROUTES.AUTH.USER_REGISTER,{data,otp});

export const userLogin = (data:LoginData) => apiClient.post(API_ROUTES.AUTH.USER_LOGIN,data);

export const sendOTP = (data:OTPData) => apiClient.post(API_ROUTES.AUTH.USER_SEND_OTP,data);

export const resendOTP = (id: string) => apiClient.post(API_ROUTES.AUTH.USER_RESEND_OTP(id));

export const forgotPassword = (data:ForgotPasswordData) => apiClient.post(API_ROUTES.AUTH.USER_FORGOT_PASSWORD,data);

export const userLogout = () => apiClient.delete(API_ROUTES.AUTH.USER_LOGOUT);

    