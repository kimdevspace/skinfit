//react query 기반(key값 조회, 캐싱싱)

import { create } from "zustand"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

//#region 화장품명 검색
// 액션
const FetchCosmetics = async (params) => {
  const response = await axios.get("/api/v1/search/cosmetic", {
    params,
    // headers : {
    //     Authorization :
    // }
  })

  if (response.data.status === "success") {
    return response.data.data
  }
  throw new Error(response.data.message || "Failed to fetch cosmetics")
}

//set 함수 : zustand store 업데이트 함수
// create : 스토어 생성
const useSearchStore = create((set) => ({
  // 디폴트값 세팅
  query: "",
  page: 1,
  limit: 10,
  filterByUserPreference: false,
  category: null,
  setQuery: (query) => set({ query }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setFilterByUserPreference: (filter) => set({ filterByUserPreference: filter }),
  setCategory: (category) => set({ category }),
}))

// React Query hook (캐싱된 데이터를 불러온다다)
export const useSearchCosmetics = () => {
  const setQuery = useSearchStore((state) => state.setQuery)
  const setPage = useSearchStore((state) => state.setPage)
  const setFilterByUserPreference = useSearchStore((state) => state.setFilterByUserPreference)
  const setCategory = useSearchStore((state) => state.setCategory)

  //useQuery 는 서버로부터 데이터를 요청하여 받아오는 GET api
  // const {data} = useQuery(쿼리 키, 쿼리 함수, 옵션);
  // 쿼리함수 => 비동기 익명 함수
  return useQuery({
    queryKey: ["searchCosmetics"],
    queryFn: FetchCosmetics,
    // 성공시 콜백함수
    onSuccess: (data) => {
      setQuery(data.query)
      setPage(data.page)
      setFilterByUserPreference(data.filterByUserPreference)
      setCategory(data.category)
    },
  })
}
//#endregion

// //#region 모든 화장품 조회
// // 액션
// const fetchAllCosmetics = async () => {
//   const response = await axios.get('/api/v1/all-cosmetics');
//   if (response.data.status === 'success') {
//     return response.data.data;
//   }
//   throw new Error('Failed to fetch cosmetics');
// };

// //set 함수 : zustand store 업데이트 함수
// // create : 스토어 생성
// const useSearchStore = create((set) => ({
//   setCosmetics: (cosmetics) => set({ cosmetics }),
//   setTotalCount: (totalCount) => set({ totalCount }),
// }));

// // React Query hook (캐싱된 데이터를 불러온다다)
// export const useAllCosmetics = () => {
//   const setCosmetics = useSearchStore((state) => state.setCosmetics);
//   const setTotalCount = useSearchStore((state) => state.setTotalCount);

//     //useQuery 는 서버로부터 데이터를 요청하여 받아오는 GET api
//     // const {data} = useQuery(쿼리 키, 쿼리 함수, 옵션);
//     // 쿼리함수 => 비동기 익명 함수
//   return useQuery({
//     queryKey : ['allCosmetics'],
//     queryFn: fetchAllCosmetics,
//     // 성공시 콜백함수
//     onSuccess: (data) => {
//       setCosmetics(data.cosmetic);
//       setTotalCount(data.totalCount);
//     },
//   });
// };
//#endregion
