//searchItem.jsx : 검색결과 하나(뱃지, 버튼 Props로 바꾸기)
// 검색완료 컴포넌트

import "./SearchItem.scss"

// props로 뱃지 표시 여부 받기
// 뱃지 or 추가 버튼
function SearchItem({ showBadge = true }) {
  return (
    <div className="search-list">
      <img src="" alt="" />
      <p className="brand-name">달바</p>
      <p>달바 미스트 블랙 트러플 100ML</p>
      {showBadge ? (
        <div className="badge isSafe">안전</div> 
      ): (
        <button className="add-btn">추가</button>
        )}
      <hr />
    </div>
  )
}



export default SearchItem
