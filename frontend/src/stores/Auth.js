import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false, // 로그인된 사용자인지 확인인
  accessToken: null,
  roleType: null, // 관리자인지 일반 사용자인지 확인
  isRegistered: false, // 회원정보 등록 여부를 저장하는 상태
  setAuth: (token, role, registered = true) => set({ 
    isAuthenticated: true, 
    accessToken: token,
    roleType: role,
    isRegistered: registered, // 회원정보 등록 여부 설정
  }),
  clearAuth: () => set({ 
    isAuthenticated: false, 
    accessToken: null,
    roleType: null,
    isRegistered: false,
  })
}));
  
export default useAuthStore;