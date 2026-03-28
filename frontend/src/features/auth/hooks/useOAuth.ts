import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/authService";
import { loginSuccess } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";
import { mapCurrentUserToView } from "../../../shared/mappers/user.mapper";

export function useOAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      const authCode = tokenResponse.code;

      if (!authCode) {
        toast.error("Google login failed: no token received");
        return;
      }

      try {
        const { message, data } = await AuthService.googleLogin(authCode);
        const { user, accessToken } = data;

        const userView = mapCurrentUserToView(user);

        toast.success(message);
        dispatch(loginSuccess({ user: userView, accessToken }));

        navigate(userView.role === "admin" ? "/admin/users" : "/home");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Google login failed");
        }
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      toast.error("Google login error");
    },
  });

  const loginWithGoogle = () => handleGoogleLogin();

  const loginWithGithub = () => {
    AuthService.initiateGithubOAuth();
  };

  return { loginWithGoogle, loginWithGithub };
}
