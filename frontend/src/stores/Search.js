//react query 기반(key값 조회, 캐싱싱)

import { create } from 'zustand';
import { useQuery } from 'react-query';
import axios from 'axios';

//#region 모든 화장품 조회
// 액션
const fetchAllCosmetics = async () => {
  const response = await axios.get('/api/v1/all-cosmetics');
  if (response.data.status === 'success') {
    return response.data.data;
  }
  throw new Error('Failed to fetch cosmetics');
};

//set 함수 : zustand store 업데이트 함수
// create : 스토어 생성 
const useSearchStore = create((set) => ({
  setCosmetics: (cosmetics) => set({ cosmetics }),
  setTotalCount: (totalCount) => set({ totalCount }),
}));

// React Query hook (캐싱된 데이터를 불러온다다)
export const useAllCosmetics = () => {
  const setCosmetics = useSearchStore((state) => state.setCosmetics);
  const setTotalCount = useSearchStore((state) => state.setTotalCount);

    //useQuery 는 서버로부터 데이터를 요청하여 받아오는 GET api 
    // const {data} = useQuery(쿼리 키, 쿼리 함수, 옵션);
    // 쿼리함수 => 비동기 익명 함수
  return useQuery({
    queryKey : ['allCosmetics'],
    queryFn: fetchAllCosmetics,
    // 성공시 콜백함수 
    onSuccess: (data) => {
      setCosmetics(data.cosmetic);
      setTotalCount(data.totalCount);
    },
  });
};
//#endregion
