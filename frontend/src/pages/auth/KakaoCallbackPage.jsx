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
      // 페이지 본문의 JSON 텍스트 가져오기
      const jsonText = document.body.textContent || document.body.innerText;
      if (jsonText && jsonText.includes("accessToken")) {
        const data = JSON.parse(jsonText);
        
        // 인증 상태 저장
        setAuth(data.accessToken, data.roleType, data.isRegistered);
        
        
        // 회원가입 상태에 따라 리다이렉트
        if (data.isRegistered) {
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