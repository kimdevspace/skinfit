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


// API 요청을 위한 데이터 변환 함수 수정
getApiPayload: (category) => {
  const { items } = get();

  // 카테고리가 없으면 전체 데이터 반환
  if (!category) {
    return {
      suitableCosmetics: get().getApiPayload("suitableCosmetics"),
      unsuitableCosmetics: get().getApiPayload("unsuitableCosmetics"),
      suitableIngredients: get().getApiPayload("suitableIngredients"),
      unsuitableIngredients: get().getApiPayload("unsuitableIngredients"),
    };
  }

  // 카테고리별 아이템과 ID 키 가져오기
  const idKey = get().getIdKey(category);
  const categoryItems = items[category] || [];
  
  console.log(`처리 카테고리: ${category}, 아이템 개수: ${categoryItems.length}`);

  // 맞는 화장품
  if (category === "suitableCosmetics") {
    const result = categoryItems
      .map((item) => {
        const cosmeticId = typeof item[idKey] === "number" ? item[idKey] : parseInt(item[idKey], 10);
        return isNaN(cosmeticId) ? null : { cosmeticId };
      })
      .filter(Boolean);
    console.log("맞는 화장품 결과:", result);
    return result;
  } 
  // 안 맞는 화장품  
  else if (category === "unsuitableCosmetics") {
    const result = categoryItems
      .map((item) => {
        const cosmeticId = typeof item[idKey] === "number" ? item[idKey] : parseInt(item[idKey], 10);
        if (isNaN(cosmeticId)) return null;

        let symptomIds = [];
        if (item.symptoms && Array.isArray(item.symptoms)) {
          symptomIds = item.symptoms
            .map((s) => (typeof s === "number" ? s : parseInt(s, 10)))
            .filter((id) => !isNaN(id));
        }

        return {
          cosmeticId,
          symptomIds: symptomIds.length > 0 ? symptomIds : []
        };
      })
      .filter(Boolean);
    console.log("안 맞는 화장품 결과:", result);
    return result;
  } 
  // 맞는 성분
  else if (category === "suitableIngredients") {
    const result = categoryItems
      .map((item) => {
        const ingredientId = typeof item[idKey] === "number" ? item[idKey] : parseInt(item[idKey], 10);
        return isNaN(ingredientId) ? null : { ingredientId };
      })
      .filter(Boolean);
    console.log("맞는 성분 결과:", result);
    return result;
  } 
  // 안 맞는 성분
  else if (category === "unsuitableIngredients") {
    const result = categoryItems
      .map((item) => {
        const ingredientId = typeof item[idKey] === "number" ? item[idKey] : parseInt(item[idKey], 10);
        if (isNaN(ingredientId)) return null;

        let symptomIds = [];
        if (item.symptoms && Array.isArray(item.symptoms)) {
          symptomIds = item.symptoms
            .map((s) => (typeof s === "number" ? s : parseInt(s, 10)))
            .filter((id) => !isNaN(id));
        }

        return {
          ingredientId,
          symptomIds: symptomIds.length > 0 ? symptomIds : []
        };
      })
      .filter(Boolean);
    console.log("안 맞는 성분 결과:", result);
    return result;
  }
  
  // 기본 반환값 (빈 배열)
  console.log("해당 카테고리 없음, 빈 배열 반환");
  return [];
},
  // 증상 리스트
  symptoms: [
    { name: "부음", value: 1 },
    { name: "열감", value: 2 },
    { name: "건조함", value: 3 },
    { name: "여드름", value: 4 },
    { name: "두드러기", value: 5 },
    { name: "가려움", value: 6 },
    { name: "따가움", value: 7 },
    { name: "기타", value: 8 },
    { name: "모름", value: 9 },
  ],

  // 증상 이름 가져오는 유틸 함수
  getSymptomNames: (symptomIds) => {
    const { symptoms } = get();
    return symptomIds
      .map((id) => symptoms.find((s) => s.value === id)?.name)
      .filter(Boolean)
      .join(", ");
  },

  setItems: (category, items) =>
    set((state) => ({
      items: {
        ...state.items,
        [category]: items,
      },
    })),

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
