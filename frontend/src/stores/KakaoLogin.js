import { useQuery } from '@tanstack/react-query';
import axios from '../api/axiosInstance.js';
import useAuthStore from './Auth.js';
import { useNavigate } from 'react-router-dom';

export const useKakaoLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

 // useQuery를 사용하여 카카오 로그인 URL 요청
 const { refetch, isLoading, error } = useQuery({
   queryKey: ['kakaoLogin'],
   queryFn: async () => {
     const response = await axios.get('oauth/kakao/login');
     return response.data;
   },
   enabled: false, // 자동 실행 방지
   onSuccess: (data) => {
     console.log('카카오 로그인 응답:', data);
     // 백엔드가 리다이렉트 URL을 반환하는 경우
     if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else {
      // 백엔드가 직접 카카오 로그인 처리를 한 경우 (토큰 등을 반환)
      if (data.accessToken) {
        console.log('카카오 로그인 데이터', data);
      // data.registered가 undefined일 경우에만 true를 사용
      const isUserRegistered = data.registered !== undefined ? data.registered : true;
      
      setAuth(
        data.accessToken,
        data.roleType || 'USER',
        isUserRegistered
      );
        // navigate('/');
      }
    }
    //  // 백엔드에서 리다이렉트 URL을 제공하는 경우
    //  if (data.redirectUrl) {
    //    window.location.href = data.redirectUrl;
    //  } else {
    //    // 리다이렉트 URL이 응답에 없는 경우, 응답 자체가 URL일 수 있음
    //    window.location.href = data;
    //  }
   },
   onError: (err) => {
     console.error('카카오 로그인 요청 실패:', err);
   }
 });

 const initiateKakaoLogin = () => {
   console.log('카카오 로그인 시작');
   refetch();
 };
 
 return { initiateKakaoLogin, isLoading, error };
};