import { create } from "zustand";

export const useCompletePopupStore = create((set) => ({
  isOpen: false,
  text: "",
  showPopup: (text) => set({ isOpen: true, text }),
  hidePopup: () => set({ isOpen: false, text: "" }),
}));
