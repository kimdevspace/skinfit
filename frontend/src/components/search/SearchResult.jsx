//SearchResult : 검색 결과(검색 결과 없어요, 검색 결과 리스트(searchItem) -> if뮨 처리)
import "./SearchResult.scss";
import SearchItem from "../../components/search/SearchItem.jsx";
import SearchPopupItem from "./SearchPopupItem.jsx";

// 서치 아이템 컴포넌트
// data : 검색 결과 배열
// location : 어디에서 사용하는지(page or popup)
// type : 화장품(cosmetic)인지 성분(ingredient)인지
// category : suitableCosmetics, suitableIngredients, unsuitableCosmetics, unsuitableIngredients
function SearchResult({ data, location, type, category }) {
  return (
    <>
      {data ? (
        // 반복문으로 검색 목록 풀어서, searchitem에 하나씩 전달
        location === "page" ? (
          data.map((item, idx) => <SearchItem key={idx} data={item} />)
        ) : (
          data.map((item, idx) => (
            <SearchPopupItem
              key={idx}
              data={item}
              type={type}
              category={category}
            />
          ))
        )
      ) : (
        <div className="wrong-search">
          <h2>검색 결과가 없어요</h2>
          <p>철자를 확인하거나 다른 키워드로 검색해주세요</p>
          <p className="ptag-2">등록되지 않은 화장품이라면?</p>
          <button className="register-btn">사진 찍어 화장품 등록하기</button>
        </div>
      )}
    </>
  );
}

export default SearchResult;
