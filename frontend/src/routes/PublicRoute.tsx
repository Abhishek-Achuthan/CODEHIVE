import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../shared/hooks/storeHooks";
import { UserRole } from "../shared/constants/auth";

const PublicRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.user);

  if (isAuthenticated) {
    if (
      isAuthenticated.role === UserRole.USER ||
      isAuthenticated.role === UserRole.MENTOR
    ) {
      return <Navigate to="/home" replace />;
    } else if (isAuthenticated.role === UserRole.ADMIN) {
      return <Navigate to="/admin/users" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;
