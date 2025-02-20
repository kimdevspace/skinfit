// src/stores/KakaoLogin.js
import { useCallback } from 'react';

export const useKakaoLogin = () => {
  // 카카오 로그인 페이지로 리다이렉트하는 함수
  const initiateKakaoLogin = useCallback(() => {
    // 현재 URL 저장 (리다이렉트 후 응답을 처리하기 위해)
    sessionStorage.setItem('pendingKakaoLogin', 'true');
    console.log('initiateKakaoLogin')
    
    // 카카오 로그인 페이지로 리다이렉트
    window.location.href = '/api/v1/oauth/kakao/login';
  }, []);

  return { initiateKakaoLogin };
};