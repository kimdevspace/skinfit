//react query 기반(key값 조회, 캐싱싱)

import { create } from "zustand";
import axios from "../api/axiosInstance.js";
import { useQuery } from "@tanstack/react-query";

//#region 화장품/성분명 검색(연관검색어)
// 명칭은 Cosmetics이지만 성분+화장품 둘다 해당됨
const FetchRelatedCosmetics = async (queryKey) => {
  const params = queryKey[1]; // 바로 params 가져오기
  const apiCategory2 = params.apiCategory2
  const response = await axios.get(`search/${apiCategory2}`, {
    params : {
      query: params.query,
    },
  });

  if (response.data.status === "success") {
    return response.data;
  }
  throw new Error(response.data.message || '검색 중 오류가 발생했습니다');
};

//set 함수 : zustand store 업데이트 함수
// create : 스토어 생성
export const useRelatedCosmeticsStore = create((set) => ({
  // 디폴트값 세팅
  query: "",
  apiCategory: '',
  setRelatedQuery: (query) => set({ query }),
  setApiCategory2: (apiCategory2) => set({ apiCategory2 }),
}));
//#endregion

// React Query (캐싱된 데이터를 불러온다다)
export const useRelatedCosmetics = () => {
  const { query, apiCategory2} =
  useRelatedCosmeticsStore();

  //useQuery 는 서버로부터 데이터를 요청하여 받아오는 GET api
  // const {data} = useQuery(쿼리 키, 쿼리 함수, 옵션);
  // 쿼리함수 => 비동기 익명 함수
  return useQuery({
    queryKey: [
      "relatedCosmetics", //queryId
       {query ,apiCategory2}
    ],
    queryFn: FetchRelatedCosmetics,
    enabled: !!query, // 검색어 있을때만 검색되게 
  });
};

export default useRelatedCosmeticsStore;

//#endregion

//#region 화장품/성분명 검색(검색바 서치)
// 액션
const FetchSearchComplete = async (queryKey) => {
  const params = queryKey[1]; // 바로 params 가져오기
  const apiCategory = params.apiCategory
  const response = await axios.get(`search/${apiCategory}/details`, {
    params : {
     query: params.query,
     filterByUserPreference: params.filterByUserPreference,
     category: params.category
   },
    // headers : {
    //     Authorization :
    // }
  });

  if (response.data.status === "success") {
    return response.data;
  }
  throw new Error(response.data.message || '검색 중 오류가 발생했습니다');
};

//set 함수 : zustand store 업데이트 함수
// create : 스토어 생성
export const useSearchCompleteStore = create((set) => ({
  // 디폴트값 세팅
  query: "",
  filterByUserPreference: false,
  category: null,
  apiCategory: '', // 성분명, 화장품명 검색 구분 

  // 업데이트 역할
  setQuery: (query) => set({ query }),
  setFilterByUserPreference: (filter) =>
    set({ filterByUserPreference: filter }),
  setCategory: (category) => set({ category }),
  setApiCategory: (apiCategory) => set({ apiCategory }),
}));
//#endregion

// React Query (캐싱된 데이터를 불러온다다)
export const useSearchComplete = () => {
  const { query ,filterByUserPreference, category, apiCategory } =
    useSearchCompleteStore();

  //useQuery 는 서버로부터 데이터를 요청하여 받아오는 GET api
  // const {data} = useQuery(쿼리 키, 쿼리 함수, 옵션);
  // 쿼리함수 => 비동기 익명 함수
  return useQuery({
    queryKey: [
      "searchComplete", //queryId
      { query,filterByUserPreference, category, apiCategory },
    ],
    queryFn: FetchSearchComplete,
    enabled: !!query, // 검색어 있을때만 검색되게 
  });
};
//#endregion

// //#region 모든 화장품 조회
// // 액션
// const fetchAllCosmetics = async () => {
//   const response = await axios.get('all-cosmetics');
//   if (response.data.status === 'success') {
//     return response.data.data;
//   }
//   throw new Error('Failed to fetch cosmetics');
// };

// //set 함수 : zustand store 업데이트 함수
// // create : 스토어 생성
// export const useAllSearchStore = create((set) => ({
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
// //#endregion
