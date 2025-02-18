import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      roleType: null,
      isRegistered: false,
      setAuth: (token, role, registered = true) => set({ 
        isAuthenticated: true, 
        accessToken: token,
        roleType: role,
        isRegistered: registered,
      }),
      clearAuth: () => set({ 
        isAuthenticated: false, 
        accessToken: null,
        roleType: null,
        isRegistered: false,
      })
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);
  
export default useAuthStore;