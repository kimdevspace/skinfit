import "./SearchBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useRelatedCosmeticsStore } from '../../stores/Search.js'


// 연관검색어 onChange 이벤트 핸들러 delay 설정(디바운싱 hook)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // value, delay 값 변경시 실행
  useEffect(() => {
    // 딜레이 후 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // 새로운 타이머 설정 전에 이전 타이머 제거
    };
  }, [value, delay]); // 의존성배열 : value, input 변경될때만 effect 실행

  return debouncedValue;
}

// 검색바 컴포넌트트
function SearchBar({ searchWord, setSearchWord, category, handleSearchSubmit }) {

  // 디바운싱
  const [inputValue, setInputValue] = useState(searchWord);

  // 연관검색어 delay 설정(훅 사용)
  const debouncedValue = useDebounce(inputValue, 500);

  // 0.5초 뒤 부모에게 값 전달
  useEffect(() => {
    setSearchWord(debouncedValue);
  }, [debouncedValue, setSearchWord]);

  return (
    <div className="search-container">
      <input
        className="search-bar"
        type="text"
        placeholder="검색어를 입력하세요."
        onChange={(e) => setInputValue(e.target.value)}
      />

      <button className="search-btn" onClick={handleSearchSubmit}>
        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
      </button>
    </div>
  );
}

export default SearchBar;
