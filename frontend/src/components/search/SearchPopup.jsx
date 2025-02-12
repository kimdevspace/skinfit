import { useState } from "react";
import "./SearchPopup.scss";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import SearchPopupItem from "./SearchPopupItem";
import Button from "../common/Button";
import { useUserInfoStore } from "../../stores/userInfo";
import { useSearchStore } from "../../stores/Search";

// type : 화장품(cosmetic)인지 성분(ingredient)인지
// suitability : 잘 맞는(suitable) / 맞지 않는(unsuitable)
// category : suitableCosmetics, suitableIngredients, unsuitableCosmetics, unsuitableIngredients
function SearchPopup({ type, suitability, category }) {
  // userInfo 스토어(잘 맞는/안 맞는, 화장품/성분)
  const {
    suitableCosmetics,
    suitableIngredients,
    unsuitableCosmetics,
    unsuitableIngredients,
    setItems,
  } = useUserInfoStore();

  // search 스토어 : 화장품 검색 api 요청
  const {
    setQuery,
    setPage,
    setLimit,
    setFilterByUserPreference,
    setCategory,
  } = useSearchStore();

  // 현재 카테고리의 아이템 목록 선택
  const currentItems = {
    suitableCosmetics,
    suitableIngredients,
    unsuitableCosmetics,
    unsuitableIngredients,
  }[category];

  //#region 팝업창 닫기
  const [isPopupOpen, setIsPopupOpen] = useState(true); // 팝업 열림 상태 관리
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 관리
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // 드래그된 위치

  const handleOverlayClick = () => {
    setIsPopupOpen(false); // Overlay 클릭 시 팝업 닫기
  };

  const handleDragStart = (e) => {
    setIsDragging(true); // 드래그 시작
    setOffset({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setIsPopupOpen(false); // 드래그 끝나면 팝업 닫기
    }
    setIsDragging(false);
  };

  const handleDragMove = (e) => {
    if (isDragging) {
      // 드래그 중에는 팝업의 위치를 변경
      const deltaX = e.clientX - offset.x;
      const deltaY = e.clientY - offset.y;
      setOffset({ x: e.clientX, y: e.clientY });
      // 여기서 팝업 위치를 업데이트 할 수 있음 (ex: setPopupPosition)
    }
  };
  //#endregion

  return (
    isPopupOpen && (
      <div className="search-popup-overlay" onClick={handleOverlayClick}>
        <div
          className="search-popup"
          onMouseDown={handleDragStart} // 드래그 시작
          onMouseMove={handleDragMove} // 드래그 중
          onMouseUp={handleDragEnd} // 드래그 끝
          onMouseLeave={handleDragEnd} // 마우스가 팝업을 떠나면 드래그 끝
        >
          <hr />
          <SearchBar />

          {/* 검색 결과 박스 */}
          <div className="search-result-box">
            {/* 검색결과 변수 : data={`검색결과`} location='popup', type={type}, category={category} */}
            <SearchResult />
          </div>

          {/* 선택한 화장품/성분 확인 박스 */}
          <div className="my-list-box">
            <p className="title">{`${
              suitability === "suitable" ? "잘 맞는" : "맞지 않는"
            } ${type === "cosmetic" ? "화장품" : "성분"}`}</p>
            <div className="my-search-list">
              {currentItems[category] ? (
                currentItems[category].map((item) => (
                  <SearchPopupItem
                    key={item.id}
                    item={item}
                    type={type}
                    category={category}
                  />
                ))
              ) : (
                <p className="info-msg">{`나와 ${
                  suitability === "suitable" ? "잘 맞는" : "맞지 않는"
                } ${
                  type === "cosmetic" ? "화장품" : "성분"
                }을 추가해주세요`}</p>
              )}
            </div>
          </div>

          <Button text="등록하기" color="pink" />
        </div>
      </div>
    )
  );
}

export default SearchPopup;
