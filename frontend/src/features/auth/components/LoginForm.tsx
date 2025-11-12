import { useForm } from "react-hook-form";
import type {
  LoginData,
  LoginFormProps,
} from "../../../shared/types/authTypes";
import { loginSchema } from "../validations/authValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { OAuthButtons } from "./OAuthButtons";
import { PasswordInput } from "./PasswordInput";
import CircularProgress from "@mui/material/CircularProgress";

export function LoginForm({
  onSubmit,
  registerUrl,
  forgotPasswordUrl,
  className,
  isLoading = false,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loading = isSubmitting || isLoading;

  return (
    <div className={`relative w-full max-w-md ${className || ""}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-md">
          <CircularProgress color="inherit" size={32} thickness={4} />
        </div>
      )}

      <header className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-normal text-white">Login</h1>
        <p className="text-sm font-light text-white/50">
          or{" "}
          <Link
            to={registerUrl!}
            className="text-white underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
          >
            create an account
          </Link>
        </p>
      </header>

      <OAuthButtons />

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/50">Or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-normal text-white/70"
          >
            Email or username
          </label>
          <input
            {...register("email")}
            type="text"
            id="email"
            disabled={loading}
            className="w-full rounded-md border border-white/20
             bg-white/5 px-3.5 py-3 text-sm font-light text-white placeholder:text-white/30 focus:border-white/30 focus:bg-white/8 focus:outline-none disabled:opacity-50"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-normal text-white/70"
          >
            Password
          </label>
          <PasswordInput
            {...register("password")}
            id="password"
            disabled={loading}
            placeholder=""
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
          <div className="mt-2 text-center">
            <Link
              to={forgotPasswordUrl!}
              className="text-xs font-light text-white/50 transition-colors hover:text-white/80"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-md bg-white px-4 py-3.5 text-sm font-normal text-black transition-all hover:translate-y-px hover:bg-white/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Enter"}
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
