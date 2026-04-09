import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/authService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";
import type { OtpRequestValues } from "../types";
import { APP_MESSAGES } from "../../../shared/constants/messages";
import type { OtpSendResult } from "./useOTP";

const OTP_EXPIRY_MS = 5 * 60 * 1000;

export function useForgotPassword() {
  const navigate = useNavigate();

  const sendOTP = async (
    data: Pick<OtpRequestValues, "email">
  ): Promise<OtpSendResult> => {
    if (!data.email) throw new Error(APP_MESSAGES.COMMON.EMAIL_REQUIRED);

    try {
      const res = await AuthService.forgotPasswordSendOtp({ email: data.email });
      toast.success(res.message);
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

  const verifyOtp = async (
    otp: string,
    values: OtpRequestValues
  ): Promise<boolean> => {
    try {
      const res = await AuthService.forgotPasswordVerifyOtp(otp, values.email);
      if (res) {
        toast.success(res.message);
        navigate("/reset-password", {
          state: { email: values.email, verified: true },
        });
        return true;
      }
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      }
    }
    return false;
  };

  return { sendOTP, verifyOtp };
}
