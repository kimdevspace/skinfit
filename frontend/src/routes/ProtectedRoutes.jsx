import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/Auth";

// 일반 사용자 보호 라우트트
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

// 회원정보 등록 페이지용 라우트
export function UserFormRoute({ children }) {
  const { isAuthenticated, isRegistered } = useAuthStore();
  
  if (!isAuthenticated) {
    // 미인증 사용자는 로그인 페이지로
    return <Navigate to="/auth/login" replace />;
  }

  if (isAuthenticated && isRegistered) {
    // 이미 회원정보 등록된 사용자는 메인 페이지로
    return <Navigate to="/" replace />;
  }

  // 인증됐지만 회원정보 미등록 사용자만 접근 가능
  return children;
}

// 인증 페이지용 라우트 (로그인, 회원가입, 비밀번호 찾기)
export function AuthRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // 인증된 사용자는 메인 페이지로 (회원정보 등록 여부와 관계없이)
    return <Navigate to="/" replace />;
  }

  // 미인증 사용자만 접근 가능
  return children;
}

// 관리자 전용 라우트트
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