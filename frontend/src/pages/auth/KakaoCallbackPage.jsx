import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/Auth.js';
import axios  from '../../api/axiosInstance.js';
import './KakaoCallbackPage.scss';

const KakaoCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      console.log('KakaoCallbackPage다')
      try {
        // URL에서 code 파라미터 가져오기
        const code = new URLSearchParams(location.search).get('code');
        
        if (!code) {
          throw new Error('인증 코드가 없습니다');
        }
        
        console.log('인증 코드 확인:', code);
        
        // 백엔드에 직접 API 요청
        const response = await axios.get(`/api/v1/login/oauth2/code/kakao?code=${code}`);
        const data = response.data;
        
        console.log('로그인 응답 데이터:', data);
        
        if (data.accessToken) {
          // 인증 상태 설정
          setAuth(
            data.accessToken,
            data.roleType || 'USER',
            data.isRegistered === true
          );
          
          // 회원가입 상태에 따라 리다이렉트
          if (data.isRegistered === false) {
            navigate('/auth/userform', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
          throw new Error('액세스 토큰이 없습니다');
        }
      } catch (error) {
        console.error('카카오 로그인 처리 중 오류:', error);
        setError(error.message || '로그인 처리 중 오류가 발생했습니다');
        setTimeout(() => navigate('/auth/login', { replace: true }), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
  }, [location.search, navigate, setAuth]);

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