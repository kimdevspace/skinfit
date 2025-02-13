import SearchBar from "../../components/search/SearchBar.jsx"
import SearchResult from "../../components/search/SearchResult.jsx"
import { useState, useEffect } from "react"
import { useSearchCompleteStore }from "../../stores/Search.js" // 검색 store (pinia)
import "./Search.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


// 카테고리 옵션
const categoryOptions = [
  { id: null, name: "전체" },
  { id: 0, name: "로션" },
  { id: 1, name: "스킨" },
  { id: 2, name: "에센스" },
  { id: 3, name: "크림" },
  { id: 4, name: "클렌징" },
  { id: 5, name: "바디" },
  { id: 6, name: "선케어어" },
];


function Search() {
  //실시간 검색어 연동 여부, setSearchWord : searchWord 변수를 바꿔주는 애
  const [searchWord, setSearchWord] = useState("")


  // 검색바 결과목록
  // 데이터 상태 업데이트트
  // const setQuery = useSearchCompleteStore((state) => state.setQuery);
  // const setCategory = useSearchCompleteStore((state) => state.setCategory);
  // const setFilterByUserPreference = useSearchCompleteStore(
  //   (state) => state.setFilterByUserPreference
  // );
  // const setLimit = useSearchCompleteStore((state) => state.setLimit);
  // const setPage = useSearchCompleteStore((state) => state.setPage);


  const { setQuery, setFilterByUserPreference, setCategory } = useSearchCompleteStore()
  const { data: cosmetics, isLoading, isError, error } = useSearchCosmetics()


  // 검색 액션 
  const submitEvent = (e) => {
    e.preventDefault();
    console.log(`검색을 시도했습니다 :${searchWord}`)
    setQuery(searchWord) // 사용자 검색어
    
  };

  //#region 잘맞는 화장품 보기 버튼

  // 잘 맞는 화장품 선택 여부 확인
  const [isActive, setIsActive] = useState(false);

    // 잘 맞는 화장품 보기 버튼 클릭 감지
    const handleUserPreferBtnClick = () => {
      setIsActive(!isActive);
      setFilterByUserPreference(!isActive)
    };
  //#endregion

  //#region 카테고리 버튼
  // 카테고리 박스 클릭 여부 확인
  const [isOpen, setIsOpen] = useState(false);

  // 선택한 카테고리 value
  // const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOption, setSelectedOption] = useState({
    id : '' ,
    name : ''
  });


  // 카테고리 옵션 드롭다운(UI)
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  
  
  // 카테고리 클릭된 옵션 감지
  //select box 커스텀 불가 ->  button 은 value값 전달이 안됨(id, name값 다루기기)
  const handleOptionClick = (option) => {
    setSelectedOption({
      id : option.id,
      name : option.name,
    });
    setIsOpen(false); // 창닫기
    setCategory(option.id) 
    console.log(option)
  };
  //#endregion

  // 로딩, 에러 확인
  useEffect(() => {
    if (isLoading) console.log("로딩 중")
    if (isError) console.log("에러", error?.message)
  }, [isLoading, isError, error])

  return (
    <div>
      <form onSubmit={submitEvent}>
        <SearchBar searchWord={searchWord} setSearchWord={setSearchWord} />

      {/* 카테고리, 잘 맞는 화장품 검색 */}
      <div className="filter">
        <div className="category">
          <div
            className={`category-btn ${isOpen ? "active" : ""}`}
            onClick={toggleDropdown}
            >
            <button>{selectedOption.name || "카테고리"}</button>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        {isOpen && (
          <ul className="category-options">
            {categoryOptions.map((option) => (
              <li key={option.id}>
                <button onClick={() => handleOptionClick(option)}>
                  {option.name}
                </button>
                </li>
              ))}
          </ul>
        )}  
    </div>
      <button
        className={`user-preference ${isActive ? "active" : ""}`}
        onClick={handleUserPreferBtnClick}
      >
        잘 맞는 화장품만 보기
      </button>
      </div>      
    </form>

      {/* 화장품 검색결과/검색결과 없을 때의 화면 */}
    <SearchResult result={cosmetics} />
    </div>

  )
}

export default Search
