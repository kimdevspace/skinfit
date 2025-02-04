import SearchBar from "../../components/search/SearchBar.jsx"
import SearchItem from "../../components/search/SearchItem.jsx"
import SearchResult from "../../components/search/SearchResult.jsx"
import { useState, useEffect, useMemo } from "react"
import useSearchStore, { useSearchCosmetics} from '../stores/Search'; // 검색 store (pinia)

function Search() {

  //검색어 연동
  //setSearchWord : searchWord 변수를 바꿔주는 애 
  const [searchWord, setSearchWord] = useState('')

  //특정 화장품명 검색 
  const { isLoading, isError, error } = useSearchCosmetics();


  // 로딩 상태와 에러 상태를 useEffect를 사용하여 로그로 출력
  useEffect(() => {
    if (isLoading) console.log('로딩 중');
    if (isError) console.log('에러', error?.message);
  }, [isLoading, isError, error]);


  // // 실시간 검색어-연관검색어 목록 
  // // useMemo : computed 
  // const filteredCosmetics = useMemo(() => {
  //   // if (!cosmetics) return [];
  //   return cosmetics.filter(item => 
  //     item.cosmeticName.includes(searchWord) //제품명만 반환  
  //   );
  // }, [cosmetics, searchWord]); 

  return (
    <div>
      <form action="">
        <SearchBar searchWord={searchWord} setSearchWord={setSearchWord}/>
      </form>
      <SearchItem showBadge={true}  />
      <SearchItem showBadge={false} />
      
      {/* 연습용 */}
      {/* <SearchResult searchWord={searchWord}/>  */}

      {/* 실시간 검색어 포함된 화장품명 리스트 전달 */}
      <SearchResult  cosmetics={}/> 

      {/* 검색버튼 사용자가 누를시 SearchResult 컴포넌트 제거하고 SearchItem 띄우기 */}
      
    </div>
  )
}

export default Search
