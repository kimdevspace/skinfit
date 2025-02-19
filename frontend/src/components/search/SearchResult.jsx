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
  if (text?.length > maxLength) {
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
  setIsSubmit,
  suitability,
}) {
  // 제출된 검색어를 저장할 상태 추가(연관검색어관리)
  const [submittedWord, setSubmittedWord] = useState("");
  // 연관검색어 목록 스토어 사용
  const { setRelatedQuery, setApiCategory2 } = useRelatedCosmeticsStore();
  const { data: relatedData } = useRelatedCosmetics();

  // 검색어 편집 중인지 추적하는 상태 추가
  const [isEditing, setIsEditing] = useState(false);

  // 검색돋보기 검색목록 스토어 사용
  const { data: searchedData, isLoading } = useSearchComplete();

  //ocr 페이지로 보내기
  const navigate = useNavigate();

  // 검색어 변경 감지
  useEffect(() => {
    if (searchWord !== submittedWord) {
      // 검색어가 변경되면 편집 모드로 전환
      setIsEditing(true);
    }
  }, [searchWord, submittedWord]);

  useEffect(() => {
    const fetchRelatedTerms = async () => {
      if (searchWord && searchWord.length > 0) {
        // API 카테고리 설정
        let apiCat = category;
        if (
          category === "suitableCosmetics" ||
          category === "unsuitableCosmetics"
        ) {
          apiCat = "cosmetic";
        } else if (
          category === "suitableIngredients" ||
          category === "unsuitableIngredients"
        ) {
          apiCat = "ingredients";
        }

        setApiCategory2(apiCat);
        setRelatedQuery(searchWord);

        // 약간의 지연 후 로그 출력 (데이터 로딩 시간 고려)
        setTimeout(() => {
          console.log("지연 후 연관검색어 데이터:", relatedData);
        }, 500);
      }
    };

    fetchRelatedTerms();
  }, [searchWord, category]);

  // 연관검색어 데이터 변경 감지용 useEffect 추가
  useEffect(() => {
    console.log("연관검색어 데이터 변경됨:", relatedData);
  }, [relatedData]);

  // 검색 제출 처리
  useEffect(() => {
    if (isSubmit && searchWord) {
      console.log("검색 제출됨:", searchWord);
      setSubmittedWord(searchWord);
      setRelatedQuery("");
      setIsEditing(false); // 편집 모드 해제
      setIsSubmit(false);
    }
  }, [isSubmit, searchWord, setIsSubmit, setRelatedQuery]);

  return (
    <>
      {/* 1. 검색어 수정 중일 때만 연관검색어 표시 */}
      {isEditing && searchWord && (
        <div className="related-margin-setting">
          {relatedData && relatedData.length > 0 ? (
            relatedData.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  const searchValue =
                    type === "cosmetic" ? item.cosmeticWithBrand : item.ingredientName;
                  setSearchWord(searchValue);
                }}
              >
                <p>
                  {truncateText(
                    type === "cosmetic" ? item.cosmeticWithBrand : item.ingredientName,
                    25
                  )}
                </p>
                <hr className="related-hr" />
              </div>
            ))
          ) : (
            <p className="wrong-search">
              연관검색어가 없어요, 오탈자를 체크해주세요!
            </p>
          )}
        </div>
      )}

      {/* {console.log(isLoading, searchedData)} */}
      {isLoading ? (
        <div>로딩 중..</div>
      ) : (
        /* 2. 편집 모드가 아닐 때만 검색결과 표시 */
        !isEditing && (
          <div className="search-result-box">
            {location !== "page"
              ? // 팝업에서 사용될 때 (검색 결과 선택용)
                type === "ingredient" && Array.isArray(searchedData)
                ? // 성분 검색 결과 표시
                  searchedData?.map((item) => (
                    <SearchPopupItem
                      key={item.ingredientId}
                      item={item}
                      type={type}
                      category={category}
                    />
                  ))
                : searchedData?.cosmetics &&
                  Array.isArray(searchedData.cosmetics) &&
                  // 화장품 검색 결과 표시
                  searchedData?.cosmetics?.map((item) => (
                    <SearchPopupItem
                      key={item.cosmeticId}
                      item={item}
                      type={type}
                      category={category}
                    />
                  ))
              : // 페이지에서 사용될 때 (검색 결과 표시용)
                datas?.cosmetics &&
                Array.isArray(datas.cosmetics) &&
                // 검색 결과 표시
                datas.cosmetics.map((item) => {
                  console.log("Item ID:", item.cosmeticId);
                  return (
                    <SearchItem
                      key={item.cosmeticId}
                      idType={item.cosmeticId}
                      data={item}
                    />
                  );
                })}
          </div>
        )
      )}
      {/* 3. 검색 결과가 없을 때 메시지 */}
      {!isEditing &&
        searchWord &&
        !isLoading &&
        !suitability &&
        (!datas?.cosmetics?.length || !searchedData?.cosmetics?.length) && (
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
