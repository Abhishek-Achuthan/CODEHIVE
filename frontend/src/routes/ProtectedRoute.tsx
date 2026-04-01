import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../shared/hooks/storeHooks";
import { MentorStatus, UserRole, type UserRole as UserRoleValue } from "../shared/constants/auth";

interface ProtectedRouteProps {
  allowedRoles?: UserRoleValue[];
  requireApprovedMentor?: boolean;
}

const ProtectedRoute = ({
  allowedRoles,
  requireApprovedMentor = false,
}: ProtectedRouteProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <Navigate
        to={currentUser.role === UserRole.ADMIN ? "/admin/users" : "/home"}
        replace
      />
    );
  }

  if (
    requireApprovedMentor &&
    (currentUser.role !== UserRole.MENTOR ||
      currentUser.mentorStatus !== MentorStatus.APPROVED)
  ) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
