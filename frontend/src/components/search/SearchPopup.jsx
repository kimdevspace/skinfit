import { useState } from "react";
import "./SearchPopup.scss";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import SearchPopupItem from "./SearchPopupItem";
import Button from "../common/Button";
import { useSearchPopupStore } from "../../stores/SearchPopup";
import axios from "../../api/axiosInstance.js";
import { useQuery, useMutation } from "@tanstack/react-query";

// type : 화장품(cosmetic)인지 성분(ingredient)인지
// suitability : 잘 맞는(suitable) / 맞지 않는(unsuitable)
// category : suitableCosmetics, suitableIngredients, unsuitableCosmetics, unsuitableIngredients
function SearchPopup({ type, suitability, category, onClose, isEdit = false }) {
  // 스토어에서 데이터 가져오기
  const items = useSearchPopupStore((state) => state.items);

  // search 스토어 : 화장품 검색 api 요청

  //#region 사용자 데이터 수정
  // API URL 매핑
  const getApiUrl = () => {
    switch (category) {
      case "suitableCosmetics":
        return "/api/v1/user/mypage/good-cosmetics";
      case "unsuitableCosmetics":
        return "/api/v1/user/mypage/bad-cosmetics";
      case "suitableIngredients":
        return "/api/v1/user/mypage/good-ingredient";
      case "unsuitableIngredients":
        return "/api/v1/user/mypage/bad-ingredient";
      default:
        return "";
    }
  };

  // API 요청 훅
  const { isLoading } = useQuery({
    queryKey: [category, "edit"],
    queryFn: () => axios.get(getApiUrl()),
    enabled: isEdit,
    onSuccess: (response) => {
      useSearchPopupStore.getState().setItems(category, response.data);
    },
  });

  // 수정 mutation
  const updateMutation = useMutation({
    mutationKey: [category, "update"],
    mutationFn: (payload) => axios.put(getApiUrl(), payload),
    onSuccess: () => {
      alert("수정이 완료되었습니다.");
      onClose();
    },
    onError: () => {
      alert("수정 중 오류가 발생했습니다.");
    },
  });

  // 등록/수정 버튼 클릭 핸들러
  const handleSubmit = () => {
    if (isEdit) {
      const payload = useSearchPopupStore.getState().getApiPayload(category);
      updateMutation.mutate(payload);
    } else {
      onClose();
    }
  };

  if (isEdit && isLoading) {
    return <div>로딩 중...</div>;
  }
  //#endregion

  //#region 팝업창 닫기
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
        <hr />
        <SearchBar />

        <div className="search-result-box">
          <SearchResult location="popup" type={type} category={category} />
        </div>

        <div className="my-list-box">
          <p className="title">
            {`${suitability === "suitable" ? "잘 맞는" : "맞지 않는"} ${
              type === "cosmetic" ? "화장품" : "성분"
            }`}
          </p>
          <div className="my-search-list">
            {items[category]?.length > 0 ? (
              items[category].map((item) => (
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
