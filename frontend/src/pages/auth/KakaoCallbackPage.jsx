import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/Auth.js';
import './KakaoCallbackPage.scss';

const KakaoCallbackPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        // pre 태그의 내용을 가져오는 함수
        const extractJsonFromPre = () => {
          const preElement = document.querySelector("pre");
          if (!preElement) {
            throw new Error("토큰 데이터를 찾을 수 없습니다 (pre 태그 없음)");
          }
          return preElement.textContent;
        };

        // JSON 파싱 시도
        const processData = (jsonText) => {
          try {
            const data = JSON.parse(jsonText);
            if (!data.accessToken) {
              throw new Error("액세스 토큰이 없습니다");
            }
            return data;
          } catch (parseError) {
            throw new Error(`JSON 파싱 오류: ${parseError.message}`);
          }
        };

        // 데이터 처리 및 리다이렉션
        const handleAuthData = (data) => {
          // 인증 상태 설정
          setAuth(
            data.accessToken,
            data.roleType || "USER",
            data.registered === true
          );

          // 회원가입 상태에 따라 리다이렉트
          if (data.registered === false) {
            navigate("/auth/userform", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        };

        // 실행
        const jsonText = extractJsonFromPre();
        const data = processData(jsonText);
        handleAuthData(data);
      } catch (error) {
        console.error("카카오 로그인 처리 중 오류:", error);
        setError(error.message);
        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => navigate("/auth/login", { replace: true }), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleKakaoCallback();
  }, [navigate, setAuth]);

  // 로딩 화면
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
            borderTop: '5px solid #3498db',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>로그인 처리 중입니다...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'red' }}>로그인 처리 중 오류가 발생했습니다</p>
          <p>오류 내용: {error}</p>
          <p>잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  // 일반적으로 이 부분은 렌더링되지 않음 (이미 리다이렉트됨)
  return null;
};

export default KakaoCallbackPage;