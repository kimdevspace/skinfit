import { create } from "zustand";

// 화장품/성분 등록 및 수정 시 사용할 스토어
export const useSearchPopupStore = create((set, get) => ({
  // 각 카테고리별 아이템을 저장하는 객체
  items: {
    suitableCosmetics: [], // 잘 맞는 화장품 배열
    suitableIngredients: [], // 잘 맞는 성분 배열
    unsuitableCosmetics: [], // 안 맞는 화장품 배열
    unsuitableIngredients: [], // 안 맞는 성분 배열
  },

  // ID 키를 가져오는 내부 함수
  getIdKey: (category) => {
    const isCosmetic = category.includes("Cosmetics");
    return isCosmetic ? "cosmeticId" : "ingredientId";
  },

  // 아이템 추가 함수
  // category: 카테고리명 (suitableCosmetics, unsuitableCosmetics 등)
  // item: 추가할 아이템 객체 (증상이 있는 경우 symptoms 배열 포함)
  addItem: (category, item) =>
    set((state) => ({
      items: {
        ...state.items,
        [category]: [...state.items[category], item],
      },
    })),

  // 아이템 제거 함수
  removeItem: (category, itemToRemove) => {
    const idKey = get().getIdKey(category);

    set((state) => ({
      items: {
        ...state.items,
        [category]: state.items[category].filter(
          (item) => item[idKey] !== itemToRemove[idKey]
        ),
      },
    }));
  },

  // API 요청을 위한 데이터 변환 함수
  getApiPayload: (category) => {
    const { items } = get();

    if (category) {
      // 단일 카테고리 변환
      const idKey = get().getIdKey(category);
      const isSuitable = category.includes("suitable");

      return items[category].map((item) => ({
        [idKey]: item[idKey],
        ...(isSuitable ? {} : { symptomIds: item.symptoms || [] }),
      }));
    } else {
      // 전체 데이터 변환
      return {
        suitableCosmetics: get().getApiPayload("suitableCosmetics"),
        unsuitableCosmetics: get().getApiPayload("unsuitableCosmetics"),
        suitableIngredients: get().getApiPayload("suitableIngredients"),
        unsuitableIngredients: get().getApiPayload("unsuitableIngredients"),
      };
    }
  },

  // 증상 리스트
  symptoms: [
    { name: "부음", value: 0 },
    { name: "열감", value: 1 },
    { name: "건조함", value: 2 },
    { name: "여드름", value: 3 },
    { name: "두드러기", value: 4 },
    { name: "가려움", value: 5 },
    { name: "따가움", value: 6 },
    { name: "기타", value: 7 },
    { name: "모름", value: 8 },
  ],

  // 증상 이름 가져오는 유틸 함수
  getSymptomNames: (symptomIds) => {
    const { symptoms } = get();
    return symptomIds
      .map((id) => symptoms.find((s) => s.value === id)?.name)
      .filter(Boolean)
      .join(", ");
  },

  // 전체 데이터 초기화
  resetItems: () =>
    set({
      items: {
        suitableCosmetics: [],
        suitableIngredients: [],
        unsuitableCosmetics: [],
        unsuitableIngredients: [],
      },
    }),
}));
