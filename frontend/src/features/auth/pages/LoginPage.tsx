import AuthLayout from "../../../layouts/AuthLayout";
import { LoginLeftIntro } from "../components/LoginLeftIntro";
import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const { login, isLoading } = useLogin();

  return (
    <AuthLayout>
      <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
        <LoginLeftIntro />
        <section
          aria-label="Login form"
          className="mx-auto w-full max-w-md md:max-w-none"
        >
          <LoginForm
            onSubmit={login}
            registerUrl="/register"
            forgotPasswordUrl="/forgot-password"
            isLoading={isLoading}
          />
        </section>
      </div>
    </AuthLayout>
  );
}
