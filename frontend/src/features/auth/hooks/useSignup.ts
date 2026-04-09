import { AuthService } from "../../../services/authService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";
import type { RegisterFormValues, OtpRequestValues } from "../types";
import { APP_MESSAGES } from "../../../shared/constants/messages";
import type { OtpSendResult } from "./useOTP";
import { useNavigate } from "react-router-dom";

const OTP_EXPIRY_MS = 5 * 60 * 1000;

export function useSignup() {
  const navigate = useNavigate();

  const sendOTP = async (data: OtpRequestValues): Promise<OtpSendResult> => {
    if (!data.email) throw new Error(APP_MESSAGES.COMMON.EMAIL_REQUIRED);

    try {
      const res = await AuthService.sendOtp({ email: data.email });
      toast.success(res.data.message);
      return {
        success: true,
        expiryTimestamp: Date.now() + OTP_EXPIRY_MS,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      }
      throw error;
    }
  };

  const verifyAndRegister = async (
    otp: string,
    values: RegisterFormValues
  ): Promise<boolean> => {
    try {
      const res = await AuthService.register(otp, values);
      toast.success(res.message);
      if (res?.success) {
        navigate("/login");
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      }
      return false;
    }
  };

  return { sendOTP, verifyAndRegister };
}
