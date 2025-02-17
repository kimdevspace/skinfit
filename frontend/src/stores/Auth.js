import { create } from 'zustand';

const useAuthStore = create((set) => ({
  accessToken: null,
  isAuthenticated: false,
  setAuth: (token) => set({ 
    isAuthenticated: true, 
    accessToken: token 
  }),
  clearAuth: () => set({ 
    isAuthenticated: false, 
    accessToken: null 
  })
}));
  
export default useAuthStore;