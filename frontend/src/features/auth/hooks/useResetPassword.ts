import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/authService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";
import type { ResetPasswordFormData } from "../types";

export function useResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email as string | undefined;
  const verified = location.state?.verified as boolean | undefined;

  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (values: ResetPasswordFormData) => {
    if (!email || !verified) {
      toast.error("OTP verification required before resetting password");
      navigate("/forgot-password");
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.resetPassword({
        email,
        password: values.password,
      });
      navigate("/login");
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to reset password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading };
}
