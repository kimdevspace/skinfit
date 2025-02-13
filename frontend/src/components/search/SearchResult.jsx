import "./SearchResult.scss"
import SearchItem from "../../components/search/SearchItem.jsx"
import SearchPopupItem from "./SearchPopupItem.jsx"
import { useRelatedCosmeticsStore, useRelatedCosmetics } from "../../stores/Search.js" // 검색 store (pinia)
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

// 서치 아이템 컴포넌트
// data : 검색 결과 배열
// location : 어디에서 사용하는지(page or popup)
// type : 화장품(cosmetic)인지 성분(ingredient)인지
// category : suitableCosmetics, suitableIngredients, unsuitableCosmetics, unsuitableIngredients
//searchWord,setSearchWord : 검색된/되고있는 단어 
// isSubmit,setIsSubmit: 검색폼 제출 여부부

// 제품명 임의로 15글자 이상일 때 .. 처리
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + ".."
  }
  return text
}

function SearchResult({ datas, location, type, category, searchWord, setSearchWord, isSubmit, setIsSubmit }) {

  // 연관검색어 목록 스토어 사용
  const { setRelatedQuery} = useRelatedCosmeticsStore()
  const { data: relatedData,isLoading, error } = useRelatedCosmetics()

    // searchWord가 변경될 때마다 연관검색어 쿼리 업데이트
    useEffect(() => {
      if (searchWord && searchWord.length > 0) {
        setRelatedQuery(searchWord);  // 연관검색어 쿼리 설정 -> api 요청 수행
        
      }
    }, [searchWord,setRelatedQuery ]); // 변경사항 있을 때 해당 훅 재실행
  

  //ocr 페이지로 보내기
  const navigate = useNavigate();

  return (
    // 백연결 후 아래 html scss 있는 내용 적용필요
    <>

      {/* 1. location에 따른 검색 결과 표시 */}
      {location === "page" ? (
        // 페이지에서 표시
        datas?.map((item) => (
          <SearchItem 
            key={item.cosmeticId || item.ingredientId} 
            data={item} 
          />
        ))
      ) : (
        // 팝업에서 표시
        datas?.map((item) => (
          <SearchPopupItem
            key={item.cosmeticId || item.ingredientId}
            data={item}
            type={type}
            category={category}
          />
        ))
      )}

      {/* 2. 검색어는 있지만 결과가 없는 경우 */}
      {isSubmit && !datas && searchWord && (
        <div className="wrong-search">
          <h2>검색 결과가 없어요</h2>
          <p>철자를 확인하거나 다른 키워드로 검색해주세요</p>
          <p className="ptag-2">등록되지 않은 화장품이라면?</p>
          <button className="register-btn" onClick={() => { navigate('/ocr')}}>사진 찍어 화장품 등록하기</button>
        </div>
      )}

  {/* 연관검색어 목록 표시 */}
  {!isSubmit && searchWord && searchWord.length > 0 && (
        <div className="margin-setting">
          {relatedData?.length > 0 ? (
            relatedData.map((cosmetic, idx) => (
              <div key={idx} 
                   onClick={() => setSearchWord(cosmetic.cosmeticWithBrand)} 
                   >
                <p>{truncateText(cosmetic.cosmeticWithBrand, 15)}</p>
                <hr />
              </div>
            ))
          ) : (
            <p className='wrong-search'>연관검색어가 없어요, 오탈자를 체크해주세요!</p>
          )}
        </div>
      )}
    </>
  )
}

export default SearchResult
