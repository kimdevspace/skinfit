import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/Auth.js';
import './KakaoCallbackPage.scss';

const KakaoCallbackPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  useEffect(() => {
    // JSON 응답 파싱
    try {
      const response = fetch(`/api/v1/login/oauth2/code/kakao${window.location.search}`);
      if (response) {
        const data = response.json();
        console.log('data1', data)
      }
      // 페이지 본문의 JSON 텍스트 가져오기
      const jsonText = document.body.textContent || document.body.innerText;
      if (jsonText && jsonText.includes("accessToken")) {
        const data = JSON.parse(jsonText);
        
        // 인증 상태 저장
        setAuth(data.accessToken, data.roleType, data.registered);
        console.log('data2', data)
        console.log('카카오 로그인 완료')
        
        // 회원가입 상태에 따라 리다이렉트
        if (data.registered) {
          navigate('/');
        } else {
          navigate('/auth/userform');
        }
      }
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      navigate('/auth/login');
    }
  }, [navigate, setAuth]);

  return (
    <div className="kakao-callback">
      <div className="kakao-callback__container">
        <h2 className="kakao-callback__title">카카오 로그인 처리 중...</h2>
        <div className="kakao-callback__spinner"></div>
      </div>
    </div>
  );
};

export default KakaoCallbackPage;