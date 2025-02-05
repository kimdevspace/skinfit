import SearchBar from "../../components/search/SearchBar.jsx"
import SearchResult from "../../components/search/SearchResult.jsx"
import { useState, useEffect } from "react"
import useSearchStore, { useSearchCosmetics } from "../../stores/Search.js" // 검색 store (pinia)
import "./Search.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";


// 카테고리 옵션
const categoryOptions = [
  { id: null, name: "전체" },
  { id: 0, name: "스킨/로션" },
  { id: 1, name: "에센스" },
  { id: 2, name: "크림" },
  { id: 3, name: "클렌징" },
];


function Search() {
  //실시간 검색어 연동 여부, setSearchWord : searchWord 변수를 바꿔주는 애
  const [searchWord, setSearchWord] = useState("")


  // 화장품명 검색 스토어
  const { setQuery, setFilterByUserPreference, setCategory, filterByUserPreference, category } = useSearchStore()
  const { data: cosmetics, isLoading, isError, error, refetch } = useSearchCosmetics()


  // 필요없어짐 form 안에 다 넣어놔서 누르는 순간 submit 됨
  // 그리고 각각의 button-submit이 아니라 하나의 form 안에 모든 버튼 넣어놔서 아래 필요없음음
  // // 검색바 검색 완료 여부
  // const [isSearchSubmitted, setIsSearchSubmitted] = useState(false)

  // // 검색 액션
  // const handleSearchSubmit = (e) => {
  //   e.preventDefault() // 새로고침 방지
  //   console.log(`검색을 시도했습니다 :${searchWord}`)
  //   setQuery(searchWord) // 사용자 검색어
  //   setIsSearchSubmitted(true)
  // }

  // 검색 액션 
  const submitEvent = (e) => {
    e.preventDefault();
    console.log(`검색을 시도했습니다 :${searchWord}`)
    setQuery(searchWord) // 사용자 검색어
    
  };

  //#region 잘맞는 화장품 보기 버튼

  
  // 잘 맞는 화장품 선택 여부 확인
  const [isActive, setIsActive] = useState(false);



  // // '잘맞는 화장품 보기 필터링' 버튼
  // const handleFilterClick = () => {
  //   setFilterByUserPreference((prevState) => !prevState) // 토글기능

  //   if (searchWord && !isSearchSubmitted) {
  //     setQuery(searchWord)
  //     setIsSearchSubmitted(true)
  //   } else if (searchWord) {
  //     setQuery(searchWord)
  //   } // 검색 완료 버튼 누른 후 잘맞는화장품보기 필터링 버튼을 누르면 반환환

  //   refetch()
  // }

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
    
  // 카테고리 선택 스토어(axios 요청)에 전달
  // const handleCategorySelect = (selectedCategory) => {
    // 전체선택 고려할 필요가 없었다.default은 null 값으로 되어있어서
    // null은 null대로 전달되게 하면 됐다다
    // setCategory(selectedCategory.id === "" ? null : selectedCategory.id)

    // //검색 단어
    // if (searchWord && !isSearchSubmitted) {
    //   setQuery(searchWord)
    //   setIsSearchSubmitted(true)

    // 재선택시 반영되게 할 필요가 없었다 그냥 value가 전달되게 하면 됐다 
    // } else if (selectedCategory.id !== category.id) {
    //   setCategory(selectedCategory.id)
    // }
    // refetch()
  }
  
  // 카테고리 클릭된 옵션 감지
  //select box 커스텀 불가 ->  button 은 value값 전달이 안됨(id, name값 다루기기)
  const handleOptionClick = (option) => {
    setSelectedOption({
      id : option.id,
      name : option.name,
    });
    setIsOpen(false); // 창닫기기
    setCategory(option.id) 
  };
  //#endregion

  // 로딩, 에러 확인
  useEffect(() => {
    if (isLoading) console.log("로딩 중")
    if (isError) console.log("에러", error?.message)
  }, [isLoading, isError, error])

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
      <form onSubmit={submitEvent}>
        <SearchBar searchWord={searchWord} setSearchWord={setSearchWord} />

      {/* 임시*/}
      {/* <select value={category} onChange={(e) => handleCategorySelect(e.target.value)}>
        <option value=""> 카테고리 선택</option>
        {CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select> */}

      {/* 카테고리, 잘 맞는 화장품 검색 */}
      <div className="filter">
        <div className="category">
          <div
        className={`category-btn ${isOpen ? "active" : ""}`}
        onClick={toggleDropdown}
      >
        <button>{selectedOption ? selectedOption : "카테고리"}</button>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      {isOpen && (
        <ul className="category-options">
          {categoryOptions.map((option) => (
            <li key={option.key}>
            {/* useState -> object 형태로 id, 둘다 저장
            button : value값이 없음 -> value useState 선언 필요요 */}
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
      
      {/* <button
        onClick={handleFilterClick}
        className="filter-btn"
        style={{
          color: filterByUserPreference ? "#FDCFB7" : "#565656",
        }}
      >
        잘맞는 화장품 보기
      </button> */}

      {/* 화장품 검색결과/검색결과 없을 때의 화면 */}
    <SearchResult result={cosmetics} />
    </div>

  )
}

export default Search
