import SearchBar from "../../components/search/SearchBar.jsx";
import SearchResult from "../../components/search/SearchResult.jsx";
import { useState, useEffect } from "react";
import { useSearchCompleteStore, useSearchComplete } from "../../stores/Search"; // 검색 store (pinia)
import "./Search.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/common/Header.jsx";
import { useNavigate } from "react-router-dom";
import { useNavigateStore } from "../../stores/Navigation.js";

// 카테고리 옵션
const categoryOptions = [
  { id: null, name: "전체" },
  { id: 0, name: "로션" },
  { id: 1, name: "스킨" },
  { id: 2, name: "에센스" },
  { id: 3, name: "크림" },
  { id: 4, name: "클렌징" },
  { id: 5, name: "바디" },
  { id: 6, name: "선케어" },
];

function Search() {
  //실시간 검색어 연동 여부, setSearchWord : searchWord 변수를 바꿔주는 애
  const [searchWord, setSearchWord] = useState("");

  // result 컴포넌트에서 쓸 제출 여부 확인
  const [isSubmit, setIsSubmit] = useState(false);

  // 잘 맞는 화장품 선택 여부 확인
  const [isActive, setIsActive] = useState(false);

  // 카테고리 박스 클릭 여부 확인
  const [isOpen, setIsOpen] = useState(false);

  // 선택한 카테고리 value
  const [selectedOption, setSelectedOption] = useState({
    id: "",
    name: "",
  });

  // 스토어 상태 데이터 & 상태관리 함수 불러오기
  const { setQuery, setFilterByUserPreference, setCategory, setApiCategory } =
    useSearchCompleteStore();

  // useQuery 훅으로 반환하는 객체(데이터) 불러오기
  // data == 유저 검색어로 검색된 결과 데이터
  const { data, isLoading, error } = useSearchComplete();

  // console.log(isLoading, "검색 결과 로딩중")
  // console.log(error, "검색 결과 랜더링 에러")
  // 헤더설정을 위함
  const { searchHistory, addSearchHistory } = useNavigateStore(); // Zustand store에서 검색 이력 관리

  // 헤더 설정
  useEffect(() => {
    console.log("검색 히스토리 변경:", searchHistory);
  }, [searchHistory]);

  const navigate = useNavigate();

  // 기본 검색 함수
  const handleSearch = (searchInput, addToHistory = true) => {
    console.log("handleSearch 시작:", { searchInput, addToHistory });

    // 1.검색시 카테고리/잘맞는화장품보기 선택 고려
    if (selectedOption && isActive) {
      setCategory(selectedOption.name);
      setFilterByUserPreference(isActive);
    } else if (selectedOption) {
      setCategory(selectedOption.name);
      // console.log("selected option", selectedOption);
    } else if (isActive) {
      setFilterByUserPreference(isActive);
    }

    // 2. 검색 관련 상태 설정
    setQuery(searchInput); // 사용자 검색어
    setApiCategory("cosmetic");
    setIsSubmit(true);
    setSearchWord(searchInput); //검색바에 보여질 단어 업데이트

    // 3.히스토리 관리(헤더 뒤로가기시 이전검색어로 가게끔)
    if (addToHistory) {
      addSearchHistory(searchInput);
      console.log(
        "히스토리 추가 후:",
        useNavigateStore.getState().searchHistory
      );
    }

    console.log("현재검색어", searchInput); //searchWord 비동기 처리
  };

  // 폼 제출 이벤트 핸들러
  const submitEvent = (e) => {
    e.preventDefault();
    handleSearch(searchWord);
  };

  //#region 잘맞는 화장품 보기 버튼

  // 잘 맞는 화장품 보기 버튼 클릭 감지
  const handleUserPreferBtnClick = () => {
    setIsActive(!isActive);
  };
  //#endregion

  //#region 카테고리 버튼

  // 카테고리 옵션 드롭다운(UI)
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 카테고리 클릭된 옵션 감지
  //select box 커스텀 불가 ->  button 은 value값 전달이 안됨(id, name값 다루기기)
  const handleOptionClick = (option) => {
    setSelectedOption({
      id: option.id,
      name: option.name,
    });
    setIsOpen(false); // 창닫기
    console.log(option);
  };
  //#endregion

  //헤더 뒤로가기 설정함수
  const handleBack = () => {
    // 1. 현재 store의 상태 확인
    const currentHistory = useNavigateStore.getState().searchHistory;
    console.log("1. 현재 전체 히스토리:", currentHistory);

    if (searchHistory.length > 0) {
      // -1 : 현재 검색어, -2 : 이전 검색어
      const prevSearch = searchHistory[searchHistory.length - 2];
      // 이전 검색어가 존재하는 경우 이전 검색어로 검색
      console.log("검색 히스토리:", searchHistory);
      console.log("이전 검색어:", prevSearch);

      if (prevSearch) {
        // 이전 검색어가 없는 경우 (첫 번째 검색인 경우)
        // 이전 페이지로 이동
        console.log("이전 검색어로 검색 시도");
        handleSearch(prevSearch, false);
      } else {
        navigate(-1);
      }
    } else {
      // 검색 기록이 전혀 없는 경우
      // 이전 페이지로 이동
      navigate(-1);
    }
  };

  return (
    <div>
      <Header title="화장품 검색" onBack={handleBack} />
      <form onSubmit={submitEvent}>
        <SearchBar searchWord={searchWord} setSearchWord={setSearchWord} />

        {/* 카테고리, 잘 맞는 화장품 검색 */}
        <div className="filter">
          <div className="category">
            <div
              className={`category-btn ${isOpen ? "active" : ""}`}
              onClick={toggleDropdown}
            >
              <button className="cursor-off">
                {selectedOption.name || "카테고리"}
              </button>
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

      {/* 화장품 검색결과/혹은 검색결과 없을 때의 화면 / 혹은 실시간 검색어 검색바에 입력시 실시간으로 연관검색어 목록 뜨게 하기기 */}
      <SearchResult
        datas={data}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        isSubmit={isSubmit}
        setIsSubmit={setIsSubmit}
        category="cosmetic"
        type="cosmetic"
        location="page"
      />
    </div>
  );
}

export default Search;
