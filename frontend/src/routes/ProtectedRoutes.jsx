import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/Auth";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/loading" state={{ from: location }} replace />;
  }

  return children;
}

export function AuthRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // 이미 인증된 사용자는 메인 페이지로
    return <Navigate to="/" replace />;
  }

  return children;
}
