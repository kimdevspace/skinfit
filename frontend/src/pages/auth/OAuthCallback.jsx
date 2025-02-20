import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/Auth.js";
import "./OAuthCallback.scss";

function OAuthCallback() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    // URL 파라미터에서 데이터 추출
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const isRegisteredStr = params.get("isRegistered");

    // 문자열을 불리언으로 변환
    const isRegistered = isRegisteredStr === "true";

    if (accessToken) {
      // 토큰 저장
      setAuth(accessToken, "USER", isRegistered);

      // 회원정보 기록 상태에 따른 페이지 이동
      if (isRegistered === true) {
        navigate("/");
      } else {
        navigate("/auth/userform");
      }
    }
  }, []);

  return <div>OAuthCallback</div>;
}

export default OAuthCallback;
