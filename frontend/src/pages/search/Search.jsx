import SearchBar from "../../components/search/SearchBar.jsx";
import SearchResult from "../../components/search/SearchResult.jsx";
import { useState, useEffect, useMemo } from "react";
import { useSearchCompleteStore, useSearchComplete } from "../../stores/Search"; // 검색 store (pinia)
import "./Search.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/common/Header.jsx";
import { useNavigate } from "react-router-dom";

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
    name: "전체",
  });

  // 필터링된 결과를 위한 새로운 상태 추가
  const [filteredResults, setFilteredResults] = useState(null);

  // 스토어 상태 데이터 & 상태관리 함수 불러오기
  const { setQuery, setCategory, setApiCategory } = useSearchCompleteStore();

  // useQuery 훅으로 반환하는 객체(데이터) 불러오기
  // data == 유저 검색어로 검색된 결과 데이터
  const { data, isLoading, error } = useSearchComplete();

  // useEffect로 필터링 처리
  useEffect(() => {
    if (!data) {
      console.log("데이터 없음, 필터링 건너뜀");
      setFilteredResults(null);
      return;
    }
    if (isActive && data.cosmetics) {
      console.log("필터 적용 전 제품 수:", data.cosmetics.length);
      const filtered = {
        ...data,
        cosmetics: data.cosmetics.filter((item) => item.safetyStatus === true),
      };
      console.log("필터 적용 후 제품 수:", filtered.cosmetics.length);
      setFilteredResults(filtered);
    } else {
      console.log("필터 미적용, 원본 데이터 사용");
      setFilteredResults(data);
    }
  }, [data, isActive]);

  const navigate = useNavigate();

  // 기본 검색 함수
  const handleSearch = (searchInput) => {
    console.log("검색 요청 파라미터:", {
      검색어: searchInput,
      카테고리: selectedOption,
      저장된카테고리: useSearchCompleteStore.getState().category,
      잘맞는화장품: isActive,
    });

    // 1.검색시 카테고리/잘맞는화장품보기 선택 고려
    if (selectedOption && isActive) {
      setCategory(selectedOption);
    } else if (selectedOption) {
      setCategory(selectedOption);
      // console.log("selected option", selectedOption);
    } else if (isActive) {
    }

    // 2. 검색 관련 상태 설정
    setQuery(searchInput); // 사용자 검색어
    setApiCategory("cosmetic");
    setIsSubmit(true);
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
    navigate(-1);
  };

  // 컴포넌트가 마운트될 때 상태 초기화
  useEffect(() => {
    // 검색어 초기화
    setSearchWord("");

    // 상태 초기화
    setIsSubmit(false);
    setIsActive(false);
    setSelectedOption({
      id: "",
      name: "전체",
    });

    // 필터링 결과 초기화
    setFilteredResults(null);

    // 스토어 상태 초기화
    setQuery("");
    setCategory({ id: null, name: "전체" });


  }, []); // 빈 의존성 배열 - 컴포넌트가 마운트될 때만 실행
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
              <button className="cursor-off">{selectedOption.name}</button>
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
        datas={filteredResults}
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
