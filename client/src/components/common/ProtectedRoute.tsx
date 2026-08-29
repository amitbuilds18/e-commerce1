import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    if (allowedRoles?.includes("superAdmin") && !allowedRoles.includes("user")) {
      return <Navigate to="/super-admin/login" state={{ from: location }} replace />;
    }
    if (allowedRoles?.includes("admin") && !allowedRoles.includes("user")) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userStr);

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      if (allowedRoles.includes("superAdmin")) {
        return <Navigate to="/super-admin/login" replace />;
      }
      if (allowedRoles.includes("admin")) {
        return <Navigate to="/admin/login" replace />;
      }
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch (e) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}
