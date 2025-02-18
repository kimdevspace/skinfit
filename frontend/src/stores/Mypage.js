import { useEffect } from "react";
import { create } from "zustand";
import axios from "../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

//
//#region 마이페이지 메인 (닉네임, 피부타입 등)
// 액션: MyPage 데이터 패칭 함수
const fetchMyPage = async () => {
  const response = await axios.get("user/mypage");
  console.log("응답데이터 (MyPage):", response.data);
  // 응답 데이터가 바로 데이터 객체라면 반환
  return response.data;
};

// Zustand 스토어 생성
export const useMyPageStore = create((set) => ({
  myInfos: null,
  setMyInfos: (infos) => {
    console.log("setMyInfos 호출됨 with:", infos);
    set({ myInfos: infos });
  },
}));

// React Query 훅
export const useMyPageInfo = () => {
  const setMyInfos = useMyPageStore((state) => state.setMyInfos);
  const queryResult = useQuery({
    queryKey: ["myPage"],
    queryFn: fetchMyPage,
    // 매번 새 데이터를 받도록 옵션 설정
    refetchOnMount: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (queryResult.data) {
      console.log("useEffect - queryResult.data 있음:", queryResult.data);
      setMyInfos(queryResult.data);
      console.log("useEffect - 스토어 업데이트 완료");
    }
  }, [queryResult.data, setMyInfos]);

  return queryResult;
};

export default useMyPageStore;
//#endregion

//
//#region Top3 데이터 불러오기
const fetchTop3Data = async () => {
  const response = await axios.get("user/mypage/bad-ingredients-three");
  console.log("Mypage.js 안좋은 성분 top 3:", response.data);
  return response.data;
};

// Zustand 스토어 생성
export const useTop3DataStore = create((set) => ({
  top3Data: [],
  setTop3Data: (data) => set({ top3Data: data }),
}));

// React Query 훅 (useEffect를 이용하여 zustand 스토어 업데이트)
export const useTop3Data = () => {
  const setTop3Data = useTop3DataStore((state) => state.setTop3Data);
  const queryResult = useQuery({
    queryKey: ["top3Data"],
    queryFn: fetchTop3Data,
    refetchOnMount: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (queryResult.data) {
      // API 응답 데이터의 ingredientNames 필드를 zustand 스토어에 저장
      console.log("useEffect - Top3 데이터:", queryResult.data.ingredientNames);
      setTop3Data(queryResult.data.ingredientNames);
    }
  }, [queryResult.data, setTop3Data]);

  return queryResult;
};
//#endregion

//
//#region 내가 등록한 화장품 목록 불러오기
const fetchMyCosmetics = async () => {
  const response = await axios.get("user/mypage/cosmetics");
  console.log("내가등록화장품", response.data);
  return response.data;
};

// Zustand 스토어 생성
export const useMyCosmeticsStore = create((set) => ({
  myMatchedCosData: [],
  myUnMatchedCosData: [],
  setMyMatchedCosData: (data) => set({ myMatchedCosData: data }),
  setMyUnMatchedCosData: (data) => set({ myUnMatchedCosData: data }),
}));

// React Query 훅 (useEffect를 사용하여 zustand 스토어 업데이트)
export const useMyCosmetics = () => {
  const setMyMatchedCosData = useMyCosmeticsStore(
    (state) => state.setMyMatchedCosData
  );
  const setMyUnMatchedCosData = useMyCosmeticsStore(
    (state) => state.setMyUnMatchedCosData
  );

  // useQuery를 사용하여 데이터를 패칭합니다.
  const queryResult = useQuery({
    queryKey: ["myCosmetics"],
    queryFn: fetchMyCosmetics,
    refetchOnMount: true,
    staleTime: 0,
  });

  // queryResult.data가 업데이트되면 zustand 스토어에 저장합니다.
  useEffect(() => {
    if (queryResult.data) {
      console.log("useEffect - 내가 등록한 화장품 데이터 조회완료:", queryResult.data);
      setMyMatchedCosData(queryResult.data.suitableCosmetics);
      setMyUnMatchedCosData(queryResult.data.unsuitableCosmetics);
    }
  }, [queryResult.data, setMyMatchedCosData, setMyUnMatchedCosData]);

  return queryResult;
};
//#endregion

//
//#region 내가 등록한 성분 목록 불러오기
const fetchMyIngredients = async () => {
  const response = await axios.get("user/mypage/ingredients");
  return response.data;
};

// Zustand 스토어 생성
export const useMyIngredientsStore = create((set) => ({
  myMatchedIngreData: [],
  myUnMatchedIngreData: [],
  setMyMatchedIngreData: (data) => set({ myMatchedIngreData: data }),
  setMyUnMatchedIngreData: (data) => set({ myUnMatchedIngreData: data }),
}));

// React Query 훅 (useEffect를 이용해 zustand 스토어 업데이트)
export const useMyIngredients = () => {
  const setMyMatchedIngreData = useMyIngredientsStore(
    (state) => state.setMyMatchedIngreData
  );
  const setMyUnMatchedIngreData = useMyIngredientsStore(
    (state) => state.setMyUnMatchedIngreData
  );

  // useQuery를 통해 데이터를 패칭합니다.
  const queryResult = useQuery({
    queryKey: ["myIngredients"],
    queryFn: fetchMyIngredients,
    refetchOnMount: true,
    staleTime: 0,
  });

  // queryResult.data가 업데이트되면 zustand 스토어를 업데이트합니다.
  useEffect(() => {
    if (queryResult.data) {
      console.log("내가 등록한 성분 데이터 조회완료:", queryResult.data);
      setMyMatchedIngreData(queryResult.data.suitableIngredients);
      setMyUnMatchedIngreData(queryResult.data.unsuitableIngredients);
    }
  }, [queryResult.data, setMyMatchedIngreData, setMyUnMatchedIngreData]);

  return queryResult;
};
//#endregion

//
//#region 리뷰 데이터 불러오기
export const fetchReviews = async () => {
  const response = await axios.get("user/mypage/review");
  return response.data;
};

// Zustand 스토어 생성
export const useReviewsStore = create((set) => ({
  myReviews: [],
  likedReviews: [],
  setMyReviews: (data) => set({ myReviews: data }),
  setLikedReviews: (data) => set({ likedReviews: data }),
}));

// React Query 훅 (useEffect를 사용해 zustand 스토어 업데이트)
export const useReviews = () => {
  const setMyReviews = useReviewsStore((state) => state.setMyReviews);
  const setLikedReviews = useReviewsStore((state) => state.setLikedReviews);
  
  // useQuery로 데이터를 패칭합니다.
  const queryResult = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    refetchOnMount: true,
    staleTime: 0,
  });
  
  // queryResult.data가 업데이트되면 zustand 스토어를 업데이트합니다.
  useEffect(() => {
    if (queryResult.data) {
      console.log("리뷰 데이터 조회 완료:", queryResult.data);
      setMyReviews(queryResult.data.myReviews);
      setLikedReviews(queryResult.data.likedReviews);
    }
  }, [queryResult.data, setMyReviews, setLikedReviews]);
  
  return queryResult;
};
//#endregion

//
//#region 성분 자세히 보기 데이터 (랭킹)
export const fetchUnsuits = async () => {
  const response = await axios.get("user/mypage/detail-unsuit-ingredients");
  return response.data;
};

// Zustand 스토어 생성
export const useUnsuitStore = create((set) => ({
  myUnsuits: [],
  setMyUnsuits: (data) => set({ myUnsuits: data }),
}));

export const useUnsuit = () => {
  const setMyUnsuits = useUnsuitStore((state) => state.setMyUnsuits);
  return useQuery({
    queryKey: ["unsuitData"],
    queryFn: fetchUnsuits,
    onSuccess: (data) => {
      console.log("안맞는 성분 랭킹 데이터 조회 완료:", data);
      setMyUnsuits(data.myReviews);
    },
    onError: (error) => {
      console.error("안맞는 성분 랭킹 데이터 조회 에러:", error);
    },
  });
};
//#endregion
