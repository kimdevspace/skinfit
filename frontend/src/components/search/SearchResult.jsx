import "./SearchResult.scss";
import SearchItem from "../../components/search/SearchItem.jsx";
import SearchPopupItem from "./SearchPopupItem.jsx";
import {
  useRelatedCosmeticsStore,
  useRelatedCosmetics,
} from "../../stores/Search.js"; // 검색 store (pinia)
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchComplete } from "../../stores/Search.js";
import Category from "../common/Category.jsx";
import { useState } from "react";

// 서치 아이템 컴포넌트
// data : 검색 결과 배열
// location : 어디에서 사용하는지(page or popup)
// type : 화장품(cosmetic)인지 성분(ingredient)인지
// category : suitableCosmetics, suitableIngredients, unsuitableCosmetics, unsuitableIngredients
//searchWord,setSearchWord : 검색된/되고있는 단어
// isSubmit,setIsSubmit: 검색폼 제출 여부

// 제품명 임의로 15글자 이상일 때 .. 처리
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "..";
  }
  return text;
};

function SearchResult({
  datas,
  location,
  type,
  category,
  searchWord,
  setSearchWord,
  isSubmit,
  setIsSubmit
}) {
  // 제출된 검색어를 저장할 상태 추가(연관검색어관리)
  const [submittedWord, setSubmittedWord] = useState("");

  // 연관검색어 목록 스토어 사용
  const { setRelatedQuery, setApiCategory2 } = useRelatedCosmeticsStore();
  const { data: relatedData } = useRelatedCosmetics();

  //**
  // 검색돋보기 검색목록 스토어 사용
  const { data: searchedData } = useSearchComplete();

  // 실시간 검색어 감지(연관검색어 api 요청) 
  useEffect(() => {
    if (searchWord && searchWord.length > 0) {
      setApiCategory2(category);
      setRelatedQuery(searchWord); // 연관검색어 쿼리 업데이트트 설정 -> api 요청 수행
      console.log("연관검색어 쿼리요청 검색어 :", searchWord);
    }

    if (isSubmit) {
      // 제출되었을 때 지금 검색어 != 이전 검색어 구분 (연관검색어 관리리)
      setSubmittedWord(searchWord);
      // 제출 시 연관검색어 쿼리 초기화
      setRelatedQuery("");
      setIsSubmit(false); // 제출 상태 초기화 

    }
  }, [isSubmit, setIsSubmit, searchWord, setRelatedQuery, setApiCategory2, category]);

  // 현재 검색어가 수정 중인지 확인(연관검색어관리)
  const isSearchWordModified = searchWord !== submittedWord;

  //ocr 페이지로 보내기
  const navigate = useNavigate();

  return (
    <>
      {/* 1. 검색어 수정 중일 때 (연관검색어 표시) */}
      {isSearchWordModified && searchWord && (
        <div className="margin-setting">
          {relatedData && relatedData.length > 0 ? (
            relatedData.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  const searchValue =
                    type === "cosmetic" ? item.cosmeticWithBrand : item.name;
                  setSearchWord(searchValue);
                }}
              >
                <p>
                  {truncateText(
                    type === "cosmetic" ? item.cosmeticWithBrand : item.name,
                    15
                  )}
                </p>
                <hr />
              </div>
            ))
          ) : (
            <p className="wrong-search">
              연관검색어가 없어요, 오탈자를 체크해주세요!
            </p>
          )}
        </div>
      )}

      {/* 2. 검색이 제출되었고 결과가 있을 때 */}
      {!isSearchWordModified && 
        searchWord &&
        (location === "page"
          ? datas?.length > 0
          : searchedData?.length > 0) && (
          <>
            {location === "page"
              ? datas?.map((item) => (
                  <SearchItem
                    key={item.cosmeticId || item.ingredientId}
                    data={item}
                  />
                ))
              : searchedData?.map((item) => (
                  <SearchPopupItem
                    key={item.cosmeticId || item.ingredientId}
                    data={item}
                    type={type}
                    category={category}
                  />
                ))}
          </>
        )}

      {/* 3. 검색이 제출되었고 결과가 없을 때 */}
      {!isSearchWordModified && 
        searchWord &&
        (location === "page" ? !datas?.length : !searchedData?.length) && (
          <div className="wrong-search">
            <h2>검색 결과가 없어요</h2>
            <p>철자를 확인하거나 다른 키워드로 검색해주세요</p>
            {location === "page" && (
              <>
                <p className="ptag-2">등록되지 않은 화장품이라면?</p>
                <button
                  className="register-btn"
                  onClick={() => navigate("/ocr")}
                >
                  사진 찍어 화장품 등록하기
                </button>
              </>
            )}
          </div>
        )}
    </>
  );
}

export default SearchResult;
