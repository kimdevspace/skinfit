import { create } from "zustand"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

//#region 마이페이지 메인(닉네임, 피부타입 등등)
// 액션
const fetchMyPage = async () => {
  const response = await axios.get("/api/v1/user/mypage")
  if (response.data.status === "success") {
    return response.data.user
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
  const response = await axios.get("/api/v1/user/mypage/bad-ingredient-three")
  return response.data
}

// create : 스토어 생성
export const useTop3DataStore = create((set) => ({
  setIngredientName: (ingredientName) => set({ ingredientName })
}))

export const useTop3Data = () => {
  const setIngredientName = useTop3DataStore((state) => state.setIngredientName)

  return useQuery({
    queryKey: ["top3Data"],
    queryFn: fetchTop3Data,
    onSuccess: (data) => {
      console.log("TOP3 데이터 조회완료", data)
      setIngredientName(data)
    },
    onError: (error) => {
      console.error("top3 성분 조회 에러", error)
    },
  })
}
//#endregion

//#region 내가 등록한 화장품 목록 불러오기
const fetchMyCosmetics = async () => {
  const response = await axios.get("/api/v1/users/mypage/cosmetics")
  return response.data
}


// create : 스토어 생성
export const useMyCosmeticsStore = create((set) => ({
  myCosmeticsData: {},
  //기존 객체 업데이트
  setMyCosmeticsData: (data) => set({ myCosmeticsData: data }),
}))

export const useMyCosmetics = () => {
  const setMyCosmeticsData = useMyCosmeticsStore((state) => state.setMyCosmeticsData)

  return useQuery({
    queryKey: ["myCosmetics"],
    queryFn: fetchMyCosmetics,
    onSuccess: (data) => {
      console.log("내가 등록한 화장품 데이터 조회완료", data)
      setMyCosmeticsData(data) // 데이터 저장
    },
    onError: (error) => {
      console.error("내가 등록한 화장품 데이터 조회 에러", error)
    },
  })
}

//#endregion 



//#region 내가 등록한 성분 목록 불러오기
const fetchMyIngredients = async () => {
  const response = await axios.get("/api/v1/user/mypage/ingredients")
  return response.data
}

// create : 스토어 생성
export const useMyIngredientsStore = create((set) => ({
  myIngredientsData: {},
  //기존 객체 업데이트
  setMyIngredientsData: (data) => set({ myIngredientsData: data }),
}))

export const useMyIngredients = () => {
  const setMyIngredientsData = useMyIngredientsStore((state) => state.setMyIngredientsData)

  return useQuery({
    queryKey: ["myIngredients"],
    queryFn: fetchMyIngredients,
    onSuccess: (data) => {
      console.log("내가 등록한 성분 데이터 조회완료", data)
      setMyIngredientsData(data) // 데이터 저장
    },
    onError: (error) => {
      console.error("내가 등록한 성분분 데이터 조회 에러", error)
    },
  })
}

//#endregion 

//#region 리뷰 데이터 불러오기
export const fetchReviews = async () => {
  const response = await axios.get("/api/v1/user/mypage/review")
  return response.data
}


// create : 스토어 생성
export const useMyReviewsStore = create((set) => ({
  myReviewsData: {},
  //기존 객체 업데이트
  setMyReviewsData: (data) => set({ myReviewsData: data })
}))

export const useMyReviews = () => {
  const setMyReviewsData = useMyReviewsStore((state) => state.setMyReviewsData)

// 캐싱싱
  return useQuery({
    queryKey: ["myReviews"],
    queryFn: fetchReviews,
    onSuccess: (data) => {
      console.log("리뷰 데이터 조회완료", data)
    },
    onError: (error) => {
      console.error("리뷰 조회 에러", error)
    },
  })
}
//#endregion 

