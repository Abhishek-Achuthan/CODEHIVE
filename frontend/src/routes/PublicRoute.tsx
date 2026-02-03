import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../shared/hooks/storeHooks";

const PublicRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.user);

  if (isAuthenticated) {
    if (isAuthenticated.role === "user" || isAuthenticated.role === "mentor") {
      return <Navigate to="/home" replace />;
    } else if (isAuthenticated.role === "admin") {
      return <Navigate to="/admin/users" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;
