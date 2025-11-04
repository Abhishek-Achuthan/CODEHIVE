import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../shared/hooks/storeHooks";

const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.user);

  if (!isAuthenticated ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
