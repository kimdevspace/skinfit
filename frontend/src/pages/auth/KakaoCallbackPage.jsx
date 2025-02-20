import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/Auth.js';
import './KakaoCallbackPage.scss';

const KakaoCallbackPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // URL에서 code 파라미터 가져오기
    const code = new URLSearchParams(window.location.search).get('code');
    
    if (!code) {
      console.error('인증 코드가 없습니다.');
      navigate('/auth/login');
      return;
    }

    // 페이지 콘텐츠에서 JSON 추출 시도
    try {
      // body 전체 텍스트 추출
      const bodyText = document.body.textContent || document.body.innerText;
      
      // JSON 형식 문자열 찾기 (중괄호로 시작하는 부분을 찾음)
      const jsonStartIndex = bodyText.indexOf('{');
      if (jsonStartIndex !== -1) {
        const jsonSubstring = bodyText.substring(jsonStartIndex);
        const jsonEndIndex = jsonSubstring.lastIndexOf('}') + 1;
        const jsonStr = jsonSubstring.substring(0, jsonEndIndex);
        
        // JSON 파싱
        const data = JSON.parse(jsonStr);
        console.log('추출된 데이터:', data);
        
        if (data.accessToken) {
          // 로그인 상태 설정
          setAuth(
            data.accessToken,
            data.roleType || 'USER',
            data.registered === true // boolean 값으로 변환
          );
          
          // 회원가입 상태에 따라 리다이렉트
          if (data.registered === false) {
            navigate('/auth/userform');
          } else {
            navigate('/');
          }
          return;
        }
      }
      
      // JSON을 찾지 못했거나 처리할 수 없는 경우
      console.error('유효한 응답 데이터를 찾을 수 없습니다.');
      navigate('/auth/login');
    } catch (error) {
      console.error('응답 처리 중 오류 발생:', error);
      navigate('/auth/login');
    }
  }, [navigate, setAuth]);

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>카카오 로그인 처리 중...</p>
    </div>
  );
};

export default KakaoCallbackPage;