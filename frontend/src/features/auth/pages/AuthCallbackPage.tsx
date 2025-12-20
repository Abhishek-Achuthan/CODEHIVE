import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";
import type { CurrentUserView } from "../../../shared/types/view/CurrentUserView";

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

        const raw: unknown = JSON.parse(decodeURIComponent(userParam));
        const obj = (raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}) as Record<
          string,
          unknown
        >;

        const userData: CurrentUserView = {
          id: String(obj.id ?? ""),
          firstName: String(obj.firstName ?? ""),
          lastName: String(obj.lastName ?? ""),
          email: String(obj.email ?? ""),
          role: String(obj.role ?? ""),
          isBlocked: Boolean(obj.isBlocked),
          avatarUrl: typeof obj.avatarUrl === "string" ? obj.avatarUrl : undefined,
        };

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
