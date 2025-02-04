//SearchResult : 검색 결과(검색 결과 없어요, 검색 결과 리스트(searchItem) -> if뮨 처리)
import "./SearchResult.scss"
import SearchItem from "../../components/search/SearchItem.jsx"

// 서치 아이템 컴포넌트트
// 아래 코드 정리

function SearchResult({ cosmetics }) {
  return (
    <>
      {cosmetics ? (
        // 반복문으로 검색 목록 풀어서, searchitem에 하나씩 전달
        cosmetics.map((cosmetic) => <SearchItem key={cosmetic.id} cosmetic={cosmetic} />)
      ) : (
        <div className="wrong-search">
          <h2>검색 결과가 없어요</h2>
          <p>철자를 확인하거나 다른 키워드로 검색해주세요</p>
          <p className="ptag-2">등록되지 않은 화장품이라면?</p>
          <button className="register-btn">사진 찍어 화장품 등록하기</button>
        </div>
      )}
    </>
  )
}

export default SearchResult
