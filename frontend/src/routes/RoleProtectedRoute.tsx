import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { isTokenValid } from "../utils/jwt";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isTokenValid(token) || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to home if user doesn't have required role
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;