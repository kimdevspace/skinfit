// src/api/axiosInstance.js
import axios from 'axios';
import useAuthStore from '../stores/Auth';

// baseURL을 설정하면 이후 요청 시 자동으로 붙습니다.
// 서버 주소가 "http://localhost:8080/api/v1/"로 시작하는 경우:
const axiosInstance = axios.create({
  baseURL: '/api/v1/', // 서버 기본 URL 설정
  withCredentials: true // 쿠키를 주고받기 위해 필수
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsedAuth = JSON.parse(authStorage);
      const accessToken = parsedAuth?.state?.accessToken;
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  } catch (error) {
    console.error("토큰 처리 중 오류 발생:", error);
    // 토큰 처리 실패해도 요청은 계속 진행
  }
  
  // FormData나 JSON에 따라 자동으로 Content-Type 설정
  return config;
});

// 응답 인터셉터: 토큰 만료 시 자동으로 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 요청이며, refresh 요청이 아닌 경우
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('auth/reissue')
    ) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰은 쿠키에 있으므로 body 없이 요청
        const response = await axiosInstance.post('auth/reissue');
        const newAccessToken = response.data.accessToken;
        
        // 새 액세스 토큰 저장
        useAuthStore.getState().setAuth(newAccessToken);
        
        // 원래 요청의 헤더에 새 토큰 설정
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;

