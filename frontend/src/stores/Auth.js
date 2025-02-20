import { create } from 'zustand';
import { persist, createJSONStorage  } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      verificationToken: null, // 내정보 수정용 검증 토큰 추가
      roleType: null,
      isRegistered: false,
      
      setAuth: (token, role, registered = true) => set({ 
        isAuthenticated: true, 
        accessToken: token,
        roleType: role,
        isRegistered: registered,
      }),
      
      // 검증 토큰 저장 함수 추가
      setVerificationToken: (token) => set({
        verificationToken: token
      }),
      
      // 검증 토큰 클리어 함수 추가
      clearVerificationToken: () => set({
        verificationToken: null
      }),
      
      clearAuth: () => set({ 
        isAuthenticated: false, 
        accessToken: null,
        verificationToken: null, // 검증 토큰도 함께 클리어
        roleType: null,
        isRegistered: false,
      })
    }),
    {
      name: 'auth-storage',
      // 이 부분이 변경됨: getStorage에서 storage로 변경
      storage: createJSONStorage(() => sessionStorage),
      // 선택적으로 추가할 수 있는 옵션 (필요시)
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        verificationToken: state.verificationToken,
        roleType: state.roleType,
        isRegistered: state.isRegistered,
      }),
    }
  )
);
  
export default useAuthStore;