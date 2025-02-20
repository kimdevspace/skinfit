import { useEffect } from "react";
import useAuthStore from '../../stores/Auth.js';
import './OAuthCallback.scss';

function OAuthCallback() {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  useEffect(() => {
    // URL 파라미터에서 데이터 추출
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const isRegistered = params.get("isRegistered");
    console.log('OAuthCallback')
    console.log('accessToken', accessToken)

    if (accessToken) {
      // 토큰 저장
      setAuth(
        accessToken,
        'USER',
        isRegistered
      );

      // 회원정보 기록록 상태에 따른 페이지 이동
      if (isRegistered === "true") {
        window.location.href = "/";
      } else {
        window.location.href = "/auth/userform";
      }
    }
  }, []);

  return <div>OAuthCallback</div>;
}

export default OAuthCallback;
