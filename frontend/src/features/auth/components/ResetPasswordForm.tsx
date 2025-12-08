import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../validations/authValidation";
import type { ResetPasswordFormData } from "../types";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthService } from "../../../services/authService";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { PasswordInput } from "./PasswordInput";
export function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const verified = location.state?.verified;

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!email || !verified) {
      toast.error("OTP verification required before resetting password");
      navigate("/forgot-password");
      return;
    }

    try {
      await AuthService.resetPassword({
        email,
        password: values.password,
      });
      navigate("/login");
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.message || "Failed to reset password");
    }
  };

  return (
    <div className="w-full max-w-md">
      <header className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-normal text-white">Reset Password</h1>
        <p className="text-sm font-light text-white/50">
          Remember your password?{" "}
          <Link
            to={'/'} replace={true}
            className="text-white underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
          >
            Log in
          </Link>
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-normal text-white/70"
          >
            New Password
          </label>
          <PasswordInput
            {...register("password")}
            id="password"
            className="w-full rounded-md border border-white/20
              bg-white/5 px-3.5 py-3 text-sm font-light text-white
              placeholder:text-white/30 focus:border-white/30 focus:bg-white/8 focus:outline-none"
            placeholder="Enter new password"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-xs font-normal text-white/70"
          >
            Confirm Password
          </label>
          <PasswordInput
            {...register("confirmPassword")}
            id="confirmPassword"
            className="w-full rounded-md border border-white/20
              bg-white/5 px-3.5 py-3 text-sm font-light text-white
              placeholder:text-white/30 focus:border-white/30 focus:bg-white/8 focus:outline-none"
            placeholder="Re-enter password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-md bg-white px-4 py-3.5 text-sm font-normal text-black transition-all hover:translate-y-px hover:bg-white/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>

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
