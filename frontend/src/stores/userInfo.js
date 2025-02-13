import { create } from "zustand";
import axios from "../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

// 화장품/성분 등록 및 수정 시 사용할 스토어
export const useUserInfoStore = create((set) => ({
  // 잘 맞는/안 맞는, 화장품/성분 저장할 변수
  suitableCosmetics: [],
  suitableIngredients: [],
  unsuitableCosmetics: [],
  unsuitableIngredients: [],

  // 잘 맞는/안 맞는, 화장품/성분의 id 저장할 변수
  suitableCosmeticsId: [],
  suitableIngredientsId: [],
  unsuitableCosmeticsId: [],
  unsuitableIngredientsId: [],

  // 선택한 아이템(화장품/성분) 추가
  addItem: (category, item) =>
    set((state) => ({
      [category]: [...state[category], item],
    })),

  // 선택한 아이템(화장품/성분) 삭제
  removeItem: (category, item) =>
    set((state) => ({
      [category]: state[category].filter((selected) => selected.id !== item.id),
    })),

  // 선택한 아이템(화장품/성분) id 추가
  addId: (category, id) =>
    set((state) => ({
      [category]: [...state[category], id],
    })),

  // 선택한 아이템(화장품/성분) id 삭제
  removeId: (category, id) =>
    set((state) => ({
      [category]: state[category].filter((selected) => selected.id !== id.id),
    })),

  // 특정 카테고리 아이템 한번에 설정
  setItems: (category, item) =>
    set({
      [category]: item,
    }),

  // 선택된 아이템들(화장품/성분) 한번에 설정(초기화 또는 데이터 로드시 사용)
  resetAllItems: () =>
    set({
      suitableCosmetics: [],
      suitableIngredients: [],
      unsuitableCosmetics: [],
      unsuitableIngredients: [],
      suitableCosmeticsId: [],
      suitableIngredientsId: [],
      unsuitableCosmeticsId: [],
      unsuitableIngredientsId: [],
    }),
}));
