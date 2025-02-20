import useAuthStore from "./Auth.js";
// src/stores/KakaoLogin.js
export const useKakaoLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    
   // 간단하게 직접 카카오 로그인 페이지로 리다이렉트
   const initiateKakaoLogin = () => {
    window.location.href = '/api/v1/oauth/kakao/login';
  };
  
    return { initiateKakaoLogin };
  };
