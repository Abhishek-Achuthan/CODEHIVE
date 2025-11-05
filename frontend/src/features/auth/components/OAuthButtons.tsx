import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/authService";
import { loginSuccess } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";


export function OAuthButtons() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code", 
    onSuccess: async (tokenResponse) => {
      try {
        console.log(tokenResponse)
        const authCode = tokenResponse.code
        if (!authCode) {
          toast.error("Google login failed: no token received");
          return;
        }

        const response = await AuthService.googleLogin(authCode);
        console.log(response)
        if (!response) return;

        const { user, accessToken } = response.data;
        dispatch(loginSuccess({ user, accessToken }));
        if (user.role === "admin") navigate("/admin/users");
        else navigate("/home");
      } catch (error) {
        console.error("Google login failed", error);
      }
    },
    onError: (error) => {
      console.error("Google login error", error);
      toast.error("Google login error");
    },
  });

  

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={()=> handleGoogleLogin()}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <GoogleIcon />
        Google
      </button>
      <button
        type="button"
        onClick={() => AuthService.initiateGithubOAuth()}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <GithubIcon />
        Github
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5C17 16.4 14.8 18 12 18a6 6 0 1 1 0-12c1.5 0 2.9.6 4 1.5l2.7-2.7A10 10 0 1 0 12 22c5.2 0 9.6-3.8 9.6-9.6 0-.6 0-1 0-1.4H12z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.8 1.8 2.8 1.3.1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.4-2.3 1.1-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.1a11.7 11.7 0 0 1 6 0c2.2-1.4 3.2-1.1 3.2-1.1.6 1.6.2 2.8.1 3.1.7.9 1.1 2 1.1 3.2 0 4.5-2.7 5.4-5.3 5.8.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" />
    </svg>
  );
}
