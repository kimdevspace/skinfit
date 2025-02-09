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

export default useMyPageStore;
//#endregion
