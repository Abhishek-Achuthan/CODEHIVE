import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import { BaseError } from "../../../shared/errors/BaseError";
import { logout } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";
import { AuthService } from "../../../services/authService";

export function useLogout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const logOut = async () => {
    try {
      await AuthService.logout();
      toast.success("Logout successfully");
    } catch (error) {
      if (error instanceof BaseError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong while logging out");
      }
    } finally {
      dispatch(logout());

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      sessionStorage.clear();

      navigate("/");
    }
  };
  return {logOut,user}
}
