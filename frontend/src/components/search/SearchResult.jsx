//SearchResult : 검색 결과(검색 결과 없어요, 검색 결과 리스트 -> if뮨 처리)
import "./SearchResult.module.scss"


function SearchResult() {
  // 검색어 입력 글자수 제한
  // 임의로 25글자 이상일 때 .. 처리
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + ".."
    }
    return text
  }

  return (
    <>
      <div className="search-result">
        <p>{truncateText("달바 미스트 블랙 트러플 뇨끼 냠냠띠 100ML", 25)}</p>
        <hr />
      </div>
    </>
  )
}

export default SearchResult
