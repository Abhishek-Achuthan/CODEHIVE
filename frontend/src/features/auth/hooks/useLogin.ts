import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { LoginData } from "../../../shared/types/authTypes";
import { AuthService } from "../../../services/authService";
import { loginSuccess } from "../../../store/slices/authSlice";
import { BaseError } from "../../../shared/errors/BaseError";

export function useLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);

      const response = await AuthService.login(data);

      toast.success(response.message);

      const { user, accessToken } = response.data;

      dispatch(loginSuccess({ user, accessToken }));

      if (response.success === true) {
        if (user.role === "user") navigate("/home");
        else if (user.role === "admin") navigate("/admin/users");
      }
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading };
}
