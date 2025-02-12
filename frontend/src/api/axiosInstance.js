// src/api/axiosInstance.js
import axios from 'axios';

// baseURL을 설정하면 이후 요청 시 자동으로 붙습니다.
// 서버 주소가 "http://localhost:8080/api/v1/"로 시작하는 경우:
const axiosInstance = axios.create({
  baseURL: '/api/v1/', // 서버 기본 URL 설정
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
