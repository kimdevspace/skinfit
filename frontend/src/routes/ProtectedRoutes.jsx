import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/Auth";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isRegistered } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/loading" state={{ from: location }} replace />;
  }

  // 로그인은 했지만 등록은 안 한 사용자는 회원정보 등록 페이지로
  if (isAuthenticated && !isRegistered && location.pathname !== "/auth/userform") {
    return <Navigate to="/auth/userform" replace />;
  }

  return children;
}

export function AuthRoute({ children }) {
  const { isAuthenticated, isRegistered } = useAuthStore();

  if (isAuthenticated && isRegistered) {
    // 인증 및 등록이 모두 완료된 사용자만 메인 페이지로
    return <Navigate to="/" replace />;
  } else if (isAuthenticated && !isRegistered) {
    // 인증은 했지만 등록은 안 한 사용자
    return <Navigate to="/auth/userform" replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, roleType } = useAuthStore();
  const location = useLocation();

  // 인증되지 않은 사용자는 로그인 페이지로
  if (!isAuthenticated) {
    return <Navigate to="/loading" state={{ from: location }} replace />;
  }

  // 인증된 사용자지만 관리자가 아닌 경우 메인 페이지로
  if (roleType !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // 관리자인 경우 정상적으로 접근 허용
  return children;
}