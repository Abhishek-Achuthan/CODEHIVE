import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layouts/AuthLayout";
import { LoginLeftIntro } from "../components/LoginLeftIntro";
import { LoginForm } from "../components/LoginForm";
import type { LoginData } from "../../../shared/types/authTypes";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/slices/authSlice";
import { AuthService } from "../../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (data: LoginData) => {

      const response = await AuthService.login(data);

      const { user, accessToken } = response.data;

      dispatch(loginSuccess({ user, accessToken }));

      if (response.success === true) {
        if (response.data.user.role === "user") {
          navigate("/home");
        } else if (response.data.user.role === "admin") {
          navigate('/admin/users')
        }
      }
  };

  return (
    <AuthLayout>
      <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
        <LoginLeftIntro />
        <section
          aria-label="Login form"
          className="mx-auto w-full max-w-md md:max-w-none"
        >
          <LoginForm
            onSubmit={handleLogin}
            registerUrl="/register"
            forgotPasswordUrl="/forgot-password"
          />
        </section>
      </div>
    </AuthLayout>
  );
}
