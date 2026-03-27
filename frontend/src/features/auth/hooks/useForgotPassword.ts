import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/authService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";
import type { OtpRequestValues } from "../types";

export function useForgotPassword() {
  const navigate = useNavigate();

  const sendOTP = async (data: Pick<OtpRequestValues, "email">): Promise<void> => {
    if (!data.email) throw new Error("Email is required");

    try {
      const res = await AuthService.forgotPasswordSendOtp({ email: data.email });
      toast.success(res.message);
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      }
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
