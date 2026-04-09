import { AuthService } from "../../../services/authService";
import { BaseError } from "../../../shared/errors/BaseError";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import type { RegisterFormValues, OtpRequestValues } from "../types";
import { APP_MESSAGES } from "../../../shared/constants/messages";

export function useSignup() {
  const sendOTP = async (data: OtpRequestValues): Promise<void> => {
    if (!data.email) throw new Error(APP_MESSAGES.COMMON.EMAIL_REQUIRED);

    try {
      const res = await AuthService.sendOtp({ email: data.email });
      toast.success(res.data.message);
    } catch (error) {
      if (error instanceof BaseError) {
        if (error.status === HttpStatusCode.Conflict) {
          toast.error(error.message);
          throw error;
        }
      }
    }
  };

  const verifyAndRegister = async (
    otp: string,
    values: RegisterFormValues
  ): Promise<boolean> => {
    try {
      const res = await AuthService.register(otp, values);
      toast.success(res.message);
      if (res?.success) return true;
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
