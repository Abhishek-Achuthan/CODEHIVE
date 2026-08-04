import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { LoginFormValues } from "../types";
import { AuthService } from "../../../services/authService";
import { loginSuccess } from "../../../store/slices/authSlice";
import { BaseError } from "../../../shared/errors/BaseError";
import type { UserApi } from "../../../shared/types/api/auth";
import { mapCurrentUserToView } from "../../../shared/mappers/user.mapper";
import { UserRole } from "../../../shared/constants/auth";

export function useLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);

      const response = await AuthService.login(data);

      toast.success(response.message);

      const { user, accessToken } = response.data;

      const userView = mapCurrentUserToView(user as UserApi);
      dispatch(loginSuccess({ user: userView, accessToken }));

      if (response.success === true) {
        if (userView.role === UserRole.ADMIN) navigate("/admin/users");
        else navigate("/home");
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
