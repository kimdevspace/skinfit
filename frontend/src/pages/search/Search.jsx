import SearchBar from "../../components/search/SearchBar.jsx"
import SearchResult from "../../components/search/SearchResult.jsx"
import { useState, useEffect } from "react"
import useSearchStore, { useSearchCosmetics } from "../../stores/Search.js" // 검색 store (pinia)
import "./Search.scss"

// 카테고리 박스 옵션
const CATEGORIES = [
  { id: null, name: "전체" },
  { id: 0, name: "스킨/로션" },
  { id: 1, name: "에센스" },
  { id: 2, name: "크림" },
  { id: 3, name: "클렌징" },
]

function Search() {
  //실시간 검색어 연동 여부, setSearchWord : searchWord 변수를 바꿔주는 애
  const [searchWord, setSearchWord] = useState("")

  // 검색바 검색 완료 여부
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false)

  // 화장품명 검색 스토어
  const { setQuery, setFilterByUserPreference, setCategory, filterByUserPreference, category } = useSearchStore()
  const { data: cosmetics, isLoading, isError, error, refetch } = useSearchCosmetics()

  // 검색 완료 액션
  const handleSearchSubmit = (e) => {
    e.preventDefault() // 새로고침 방지
    console.log(`검색을 시도했습니다 :${searchWord}`)
    setQuery(searchWord) // 사용자 검색어
    setIsSearchSubmitted(true)
  }

  //#region 잘맞는 화장품 보기 버튼

  // '잘맞는 화장품 보기 필터링' 버튼
  const handleFilterClick = () => {
    setFilterByUserPreference((prevState) => !prevState) // 토글기능

    if (searchWord && !isSearchSubmitted) {
      setQuery(searchWord)
      setIsSearchSubmitted(true)
    } else if (searchWord) {
      setQuery(searchWord)
    } // 검색 완료 버튼 누른 후 잘맞는화장품보기 필터링 버튼을 누르면 반환환

    refetch()
  }
  //#endregion

  //#region 카테고리 버튼

  // 어떻게 활용?
  // // 카테고리 박스 클릭 여부 확인
  // const [isOpen, setIsOpen] = useState(false);

  // // 카테고리 옵션 드롭다운(UI)
  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen)
  // }

  // 카테고리 선택 스토어(axios 요청)에 전달
  const handleCategorySelect = (selectedCategory) => {
    // 전체선택 고려하기
    setCategory(selectedCategory.id === "" ? null : selectedCategory.id)

    if (searchWord && !isSearchSubmitted) {
      setQuery(searchWord)
      setIsSearchSubmitted(true)
    } else if (selectedCategory.id !== category.id) {
      setCategory(selectedCategory.id)
    }
    refetch()
  }
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
      <form onSubmit={handleSearchSubmit}>
        <SearchBar searchWord={searchWord} setSearchWord={setSearchWord} />
      </form>

      {/* 카테고리 버튼, 잘맞는 화장품 보기 필터링 버튼 */}
      <select value={category} onChange={(e) => handleCategorySelect(e.target.value)}>
        <option value=""> 카테고리 선택</option>
        {CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleFilterClick}
        className="filter-btn"
        style={{
          color: filterByUserPreference ? "#FDCFB7" : "#565656",
        }}
      >
        잘맞는 화장품 보기
      </button>

      {/* 화장품 검색결과/검색결과 없을 때의 화면 */}
      <SearchResult result={cosmetics} />
    </div>
  )
}

export default Search
