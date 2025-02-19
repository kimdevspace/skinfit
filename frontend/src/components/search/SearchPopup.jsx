import { useState, useEffect } from "react";
import "./SearchPopup.scss";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import SearchPopupItem from "./SearchPopupItem";
import Button from "../common/Button";
import { useSearchPopupStore } from "../../stores/SearchPopup";
import axios from "../../api/axiosInstance.js";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  useRelatedCosmeticsStore,
  useSearchCompleteStore,
} from "../../stores/Search.js";

// type : 화장품(cosmetic)인지 성분(ingredient)인지
// suitability : 잘 맞는(suitable) / 맞지 않는(unsuitable)
// category : suitableCosmetics, suitableIngredients, unsuitableCosmetics, unsuitableIngredients
function SearchPopup({ type, suitability, category, onClose, isEdit = false }) {
  // 검색 완료 여부
  const [isSubmit, setIsSubmit] = useState(false);

  // **
  // 스토어에서 검색 돋보기, 연관검색어 api 요청 구분 인자 가져오기 & 검색 쿼리 파라미터
  const { setApiCategory2, setRelatedQuery } = useRelatedCosmeticsStore();
  const { setApiCategory, setQuery } = useSearchCompleteStore();

  //실시간 검색어 연동 여부, setSearchWord : searchWord 변수를 바꿔주는 애
  const [searchWord, setSearchWord] = useState("");

  const categoryItems = useSearchPopupStore(
    (state) => state.items[category] || []
  );

  // **
  // 검색 완료시 api 요청
  const handleSearchSubmit = () => {
    setQuery(searchWord); // 검색어 쿼리 전달
    if (type === "ingredient") {
      setApiCategory("ingredients"); // 검색어 api 경로 쿼리 전달
    } else {
      console.log("회원정보폼 화장품검색", type);
      setApiCategory(type); // 검색어 api 경로 쿼리 전달
    }
    setIsSubmit(true);
  };
  
  // 팝업이 열릴 때마다 검색 관련 상태 초기화
  useEffect(() => {
    setSearchWord("");
    setRelatedQuery("");
    setQuery("");
    // 팝업이 ingredient용이면 api 카테고리를 ingredients로 초기화, 그렇지 않으면 type 그대로
    setApiCategory(type === "ingredient" ? "ingredients" : type);
  }, [setRelatedQuery, setApiCategory, setQuery, type]);

  // 화장품명/성분명 검색 완료 & 연관검색 api 요청
  useEffect(() => {
    if (type === "ingredient") {
      setApiCategory("ingredients"); // 연관검색어 api 경로 쿼리 전달
    } else {
      setApiCategory(type); // 연관검색어 api 경로 쿼리 전달
    }
    setRelatedQuery(searchWord); // ** 연관검색어 쿼리 전달 // 여기 위치가 맞나?
  }, [type, searchWord, setApiCategory, setRelatedQuery]); // 무한루프 방지 // **

  // 스토어에서 데이터 가져오기
  const items = useSearchPopupStore((state) => state.items);

  // 팝업창 관련 변수
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  //#region 사용자 데이터 수정
  // API URL 매핑
  const getApiUrl = () => {
    switch (category) {
      case "suitableCosmetics":
        return "user/mypage/good-cosmetics";
      case "unsuitableCosmetics":
        return "user/mypage/bad-cosmetics";
      case "suitableIngredients":
        return "user/mypage/good-ingredients";
      case "unsuitableIngredients":
        return "user/mypage/bad-ingredients";
      default:
        return "";
    }
  };

  // 수정 mutation
  const updateMutation = useMutation({
    mutationFn: (payload) => axios.put(getApiUrl(), payload),
    onSuccess: () => {
      alert("수정이 완료되었습니다.");
      onClose();
    },
    onError: (error) => {
      console.log(error);
      console.error("수정 오류:", error.response?.data || error.message);
      alert(
        `수정 중 오류가 발생했습니다: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // 등록/수정 버튼 클릭 핸들러
  const handleSubmit = () => {
    if (isEdit) {
      const payload = useSearchPopupStore.getState().getApiPayload(category);
      console.log("payload", payload);
      updateMutation.mutate(payload);
    } else {
      onClose();
    }
  };

  //#endregion

  //#region 팝업창 닫기
  // 오버레이 클릭 시 팝업 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 드래그 시작
  const handleDragStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // 드래그 중
  const handleDragMove = (e) => {
    e.stopPropagation();
    if (!isDragging) return;

    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: 0, y: deltaY });

    // 아래로 150px 이상 드래그되면 닫기 준비
    if (deltaY > 150) {
      setIsDragging(false);
      onClose();
    }
  };

  // 드래그 끝
  const handleDragEnd = (e) => {
    e.stopPropagation();
    if (!isDragging) return;

    setIsDragging(false);
    // 드래그가 충분하지 않으면 원위치
    setDragOffset({ x: 0, y: 0 });
  };

  const popupStyle = {
    transform: `translateY(${dragOffset.y}px)`,
    transition: !isDragging ? "transform 0.3s ease-out" : "none",
  };

  //#endregion

  const { isLoading, data } = useQuery({
    queryKey: [category, "edit"],
    queryFn: () => axios.get(getApiUrl()),
    enabled: isEdit,
  });

  // 항상 같은 순서로 호출되는 단일 useEffect로 처리
  useEffect(() => {
    // data가 존재하고 isEdit일 때만 스토어 업데이트
    if (data && isEdit) {
      console.log(`${category} 데이터 로드 성공:`, data.data);
      useSearchPopupStore.getState().setItems(category, data.data);
    }
  }, [data, category, isEdit]);

  return (
    <div className="search-popup-overlay" onClick={handleOverlayClick}>
      <div
        className="search-popup"
        style={popupStyle}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <hr className="related-hr"/>
        <SearchBar
          searchWord={searchWord}
          setSearchWord={setSearchWord}
          category={category}
          handleSearchSubmit={handleSearchSubmit}
        />

        <div className="search-result-box">
          <SearchResult
            location="popup"
            type={type}
            category={category}
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            isSubmit={isSubmit}
            setIsSubmit={setIsSubmit}
            suitability={suitability}
          />
        </div>

        <div className="my-list-box">
          <p className="title">
            {`${suitability === "suitable" ? "잘 맞는" : "맞지 않는"} ${
              type === "cosmetic" ? "화장품" : "성분"
            }`}
          </p>
          <div className="my-search-list">
            {categoryItems.length > 0 ? (
              categoryItems.map((item) => (
                <SearchPopupItem
                  key={item.cosmeticId || item.ingredientId}
                  item={item}
                  type={type}
                  category={category}
                />
              ))
            ) : (
              <p className="info-msg">
                {`나와 ${
                  suitability === "suitable" ? "잘 맞는" : "맞지 않는"
                } ${type === "cosmetic" ? "화장품" : "성분"}을 추가해주세요`}
              </p>
            )}
          </div>
        </div>

        <Button
          text={isEdit ? "수정하기" : "등록하기"}
          color="pink"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
export default SearchPopup;
