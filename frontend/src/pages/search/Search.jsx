import SearchBar from "../../components/search/SearchBar.jsx"
import SearchItem from "../../components/search/SearchItem.jsx"
import SearchResult from "../../components/search/SearchResult.jsx"
import { useState } from "react"


function Search() {

  //실시간 검색어어 연동
  //setSearchWord : searchWord 변수를 바꿔주는 애 
  const [searchWord, setSearchWord] = useState('')


  return (
    <div>
      <form action="">
        <SearchBar searchWord={searchWord} setSearchWord={setSearchWord}/>
      </form>
      <SearchItem showBadge={true}  />
      <SearchItem showBadge={false} />
      
      <SearchResult searchWord={searchWord}/> 
      
    </div>
  )
}

export default Search
