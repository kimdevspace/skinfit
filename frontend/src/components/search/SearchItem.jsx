// 검색완료 컴포넌트
import "./SearchItem.scss"

// 제품명 임의로 15글자 이상일 때 .. 처리
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + ".."
  }
  return text
}

function SearchItem({ cosmetic }) {
  return (
    <div className="margin-setting">
      <div className="search-wrapper">
        <div>
          <img className="cosmetic-image" src={cosmetic.imageURL} alt="cosmetic_product_image" />
          <p className="brand-name">{cosmetic.brandName}</p>
          <p>{truncateText(cosmetic.cosmeticName, 15)}</p>
        </div>

        {/* 뱃지 or 추가버튼  */}h
        {/* <div className="badge-or-btn">
        {showBadge ? (
          <div className="badge isSafe">안전</div>
        ) : (
          <button className="add-btn">추가</button>
        )}
      </div> */}
      </div>
      <hr />
    </div>
  )
}

export default SearchItem
