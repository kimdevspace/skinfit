import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/Auth.js';
import './KakaoCallbackPage.scss';

const KakaoCallbackPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // 현재 URL에서 code 가져오기
    const code = new URLSearchParams(window.location.search).get('code');

    // 백엔드 API 호출
    fetch(`/api/v1/login/oauth2/code/kakao?code=${code}`)
      .then(response => response.json())
      .then(data => {
        console.log('로그인 응답:', data);
        
        if (data.accessToken) {
          // 액세스 토큰 저장
          console.log('액세스 토큰 저장', data)
          setAuth(
            data.accessToken,
            data.roleType || 'USER',
            data.registered || true
          );
          
          // 회원가입 여부에 따라 리다이렉트
          if (data.registered) {
            navigate('/');  // 메인 페이지로
          } else {
            navigate('/auth/userform');  // 회원가입 폼으로
          }
        }
      })
      .catch(error => {
        console.error('로그인 처리 중 에러:', error);
        navigate('/login');  // 에러시 로그인 페이지로
      });
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default KakaoCallbackPage;