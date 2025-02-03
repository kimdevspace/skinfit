//Searchbar 컴포넌트: 검색어 입력창 (성분, 화장품 검색하는 것 props로 넘겨줘야함)

import "./SearchBar.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchBar({ searchWord, setSearchWord }) {
  return (
    <div className="search-container">
      <input className="search-bar" type="text" placeholder="검색어를 입력하세요."
        value={searchWord} onChange={ (e) => setSearchWord(e.target.value)}/>
      <button className='search-btn'><FontAwesomeIcon icon={faMagnifyingGlass} size="lg" /></button>
    </div>
  )
}

export default SearchBar
