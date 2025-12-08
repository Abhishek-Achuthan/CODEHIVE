import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../validations/authValidation";
import type { ForgotPasswordData } from "../../../shared/types/api/auth";
import type { ForgotPasswordFormProps } from "../types";
import { Link } from "react-router-dom";
import { useOTP } from "../hooks/useOTP";
import { OTPModal } from "../../../shared/ui/dialog/OTPModal";
import { AuthService } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";

export function ForgotPasswordForm({
  loginUrl = "/login",
  className,
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();

  const {
    otpModalOpen,
    setOtpModalOpen,
    handleSubmit: handleOtpSubmit,
    handleVerifyOtp,
    handleResend,
  } = useOTP<ForgotPasswordData>(
    async (data) => {
      if (!data.email) throw new Error("Email is required");
      
      try {
        const res = await AuthService.forgotPasswordSendOtp({email:data.email});
        toast.success(res.message)
      } catch (error) {
        if(error instanceof BaseError) {
          toast.error(error.message)
        }
      }
    },
    
   async (otp, values) => {
    
    try {
      const res = await AuthService.forgotPasswordVerifyOtp(otp, values.email);
      if (res) {
        toast.success(res.message)
        navigate("/reset-password", {
          state: { email: values.email, verified: true },
        });
        return true;
      }
    } catch (error) {
      if(error instanceof BaseError) {
        toast.error(error.message);
      }
    }
    return false;
  },
    "email"
  );

  const onSubmit = async (values: ForgotPasswordData) => {
    await handleOtpSubmit(values);
  };

  return (
    <div className={`w-full max-w-md ${className || ""}`}>
      <header className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-normal text-white">
          Forgot Password
        </h1>
        <p className="text-sm font-light text-white/50">
          Remember your password?{" "}
          <Link
            to={loginUrl}
            className="text-white underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
          >
            Log in
          </Link>
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-normal text-white/70"
          >
            Email address
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="w-full rounded-md border border-white/20
              bg-white/5 px-3.5 py-3 text-sm font-light text-white
              placeholder:text-white/30 focus:border-white/30 focus:bg-white/8 focus:outline-none"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-md bg-white px-4 py-3.5 text-sm font-normal text-black transition-all hover:translate-y-px hover:bg-white/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      <OTPModal
        open={otpModalOpen}
        onOpenChange={setOtpModalOpen}
        onVerify={(otp) => handleVerifyOtp(otp, getValues())}
        onResend={() => handleResend(getValues())}
      />
      
      <footer className="mt-12 flex justify-center gap-5">
        <Link
          to="/terms"
          className="text-[11px] font-light text-white/40 transition-colors hover:text-white/70"
        >
          Terms of Service
        </Link>
        <Link
          to="/privacy"
          className="text-[11px] font-light text-white/40 transition-colors hover:text-white/70"
        >
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}