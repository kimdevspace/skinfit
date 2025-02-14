import { create } from "zustand"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

//#region 마이페이지 메인(닉네임, 피부타입 등등)
// 액션
const fetchMyPage = async () => {
  const response = await axios.get("/user/mypage")
  if (response.data.status === "success") {
    return response.data
  }
  throw new Error("Failed to fetch cosmetics")
}

//set 함수 : zustand store 업데이트 함수
// create : 스토어 생성
export const useMyPageStore = create((set) => ({
  setNickname: (nickname) => set({ nickname }),
  setSkinTypeId: (skinTypeId) => set({ skinTypeId }),
}))

// React Query hook (캐싱된 데이터를 불러온다다)
export const useMyPageInfo = () => {
  const setNickname = useMyPageStore((state) => state.setNickname)
  const setSkinTypeId = useMyPageStore((state) => state.setSkinTypeId)

  //useQuery 는 서버로부터 데이터를 요청하여 받아오는 GET api
  // const {data} = useQuery(쿼리 키, 쿼리 함수, 옵션);
  // 쿼리함수 => 비동기 익명 함수
  return useQuery({
    queryKey: ["myPage"],
    queryFn: fetchMyPage,
    // 성공시 콜백함수
    onSuccess: (data) => {
      setNickname(data.nickname)
      setSkinTypeId(Array.isArray(data.skinTypeId ? data.skinTypeId : [data.skinTypeId]))
    },
  })
}

export default useMyPageStore
//#endregion

//#region top3 데이터 불러오기

const fetchTop3Data = async () => {
  const response = await axios.get("/user/mypage/bad-ingredient-three")
  return response.data
}

// create : 스토어 생성
export const useTop3DataStore = create((set) => ({
  top3Data :[],
  setTop3Data: (data) => set({ top3Data: data })
}))


export const useTop3Data = () => {
  const setTop3Data = useTop3DataStore((state) => state.setTop3Data)

  return useQuery({
    queryKey: ["top3Data"],
    queryFn: fetchTop3Data,
    onSuccess: (data) => {
      console.log("TOP3 데이터 조회완료", data)
      setTop3Data(data.ingredients)
    },
    onError: (error) => {
      console.error("top3 성분 조회 에러", error)
    },
  })
}
//#endregion

//#region 내가 등록한 화장품 목록 불러오기
const fetchMyCosmetics = async () => {
  const response = await axios.get("/users/mypage/cosmetics")
  return response.data
}


// create : 스토어 생성
export const useMyCosmeticsStore = create((set) => ({
  myMatchedCosData: [],
  myUnmatchedCosData : [],
  //기존 객체 업데이트
  setMyMatchedCosData: (data) => set({ myMatchedCosData: data }),
  setMyUnMatchedCosData: (data) => set({ myUnMatchedCosData: data }),

}))

export const useMyCosmetics = () => {
  const setMyMatchedCosData = useMyCosmeticsStore((state) => state.setMyMatchedCosData)
  const setMyUnMatchedCosData = useMyCosmeticsStore((state) => state.setMyUnMatchedCosData)

  return useQuery({
    queryKey: ["myCosmetics"],
    queryFn: fetchMyCosmetics,
    onSuccess: (data) => {
      console.log("내가 등록한 화장품 데이터 조회완료", data)
      setMyMatchedCosData(data.suitableCosmetics) // 데이터 저장
      setMyUnMatchedCosData(data.unsuitableCosmetics)
    },
    onError: (error) => {
      console.error("내가 등록한 화장품 데이터 조회 에러", error)
    },
  })
}

//#endregion 



//#region 내가 등록한 성분 목록 불러오기
const fetchMyIngredients = async () => {
  const response = await axios.get("/user/mypage/ingredients")
  return response.data
}

// create : 스토어 생성
export const useMyIngredientsStore = create((set) => ({
  myMatchedingrsData: [],
  myUnmatchedingrsData : [],
  //기존 객체 업데이트
  setMyMatchedingrsData: (data) => set({ myMatchedingrsData: data }),
  setMyUnMatchedingrsData: (data) => set({ myUnMatchedingrsData: data }),
  setMyIngredientsData: (data) => set({ myIngredientsData: data }),
}))

export const useMyIngredients = () => {
  const setMyMatchedingrsData = useMyIngredientsStore((state) => state.setMyMatchedingrsData)
  const setMyUnMatchedingrsData = useMyIngredientsStore((state) => state.setMyUnMatchedingrsData)

  return useQuery({
    queryKey: ["myIngredients"],
    queryFn: fetchMyIngredients,
    onSuccess: (data) => {
      console.log("내가 등록한 성분 데이터 조회완료", data)
      setMyMatchedingrsData(data.suitableIngredients) // 데이터 저장
      setMyUnMatchedingrsData(data.unsuitableIngredients)
    },
    onError: (error) => {
      console.error("내가 등록한 성분분 데이터 조회 에러", error)
    },
  })
}

//#endregion 

//#region 리뷰 데이터 불러오기
export const fetchReviews = async () => {
  const response = await axios.get("/user/mypage/review")
  return response.data
}


// Zustand store 생성
export const useReviewsStore = create((set) => ({
  myReviews: [],
  likedReviews: [],
  setMyReviews: (data) => set({ myReviews: data }),
  setLikedReviews: (data) => set({ likedReviews: data })
}))

// 커스텀 훅: 리뷰 데이터 조회 및 상태 저장
export const useReviews = () => {
  const setMyReviews = useReviewsStore((state) => state.setMyReviews)
  const setLikedReviews = useReviewsStore((state) => state.setLikedReviews)

  return useQuery({
    queryKey: ['reviews'], // 쿼리 키는 하나로 설정
    queryFn: fetchReviews, // 동일한 API 호출 함수 사용
    onSuccess: (data) => {
      console.log('리뷰 데이터 조회 완료', data)
      setMyReviews(data.myReviews) // Zustand 스토어에 myReviews 저장
      setLikedReviews(data.likedReviews) // Zustand 스토어에 likedReviews 저장
    },
    onError: (error) => {
      console.error('리뷰 데이터 조회 에러', error)
    },
  })
}
//#endregion 



