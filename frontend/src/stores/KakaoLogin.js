// src/stores/KakaoLogin.js
export const useKakaoLogin = () => {    
   // 간단하게 직접 카카오 로그인 페이지로 리다이렉트
   const initiateKakaoLogin = () => {
    window.location.href = '/api/v1/oauth/kakao/login';

    const preElement = document.querySelector("pre");

    console.log(preElement)
  };
  
    return { initiateKakaoLogin };
  };
