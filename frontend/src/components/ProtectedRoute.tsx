import { Navigate } from "react-router";
//import { useAuth } from "../hooks/useAuth";
//import { LoadingSpinner } from "./LoadingSpinner";
import { authApi } from "../lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  /*
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
*/
  if (!authApi.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
