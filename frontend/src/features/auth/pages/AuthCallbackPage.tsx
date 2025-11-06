import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const userParam = params.get("user");

        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('accessToken='))
          ?.split('=')[1];


        if (!token || !userParam) {
          console.error("Missing credentials:", { token: !!token, userParam: !!userParam });
          toast.error("Authentication failed: Missing credentials");
          navigate("/");
          return;
        }

        const userData = JSON.parse(decodeURIComponent(userParam));

        localStorage.setItem("accessToken", token);
        dispatch(loginSuccess({ user: userData, accessToken: token }));
        
        toast.success(`Welcome back, ${userData.firstName}!`);
        
        if (userData.role === "admin") {
          navigate("/admin/users", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed");
        navigate("/", { replace: true });
      }
    };

    processCallback();
  }, [dispatch, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-lg text-white">Signing you in...</div>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white mx-auto"></div>
      </div>
    </div>
  );
}
