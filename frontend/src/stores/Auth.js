import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  accessToken: null,
  roleType: null,
  setAuth: (token, role) => set({ 
    isAuthenticated: true, 
    accessToken: token,
    roleType: role,
  }),
  clearAuth: () => set({ 
    isAuthenticated: false, 
    accessToken: null,
    roleType: null,
  })
}));
  
export default useAuthStore;