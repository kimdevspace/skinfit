// 검색완료 컴포넌트
import "./SearchItem.scss";

// 제품명 임의로 15글자 이상일 때 .. 처리
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "..";
  }
  return text;
};

// key : cosmeticId || indgredientId
// data : item

function SearchItem({ key, data }) {
  return (
    <div className="margin-setting">
      <div className="search-wrapper">
        {key === "cosmeticId" ? (
          <div>
            <img
              className="cosmetic-image"
              src={data.imageURL}
              alt="cosmetic_product_image"
            />
            <p className="brand-name">{data.brandName}</p>
            <p>{truncateText(data.cosmeticName, 15)}</p>
            {/* 안전/유의 뱃지  */}
            <div className="badge-or-btn">
              <div className="badge isSafe">{data.safetyStatus}</div>
            </div>
          </div>
        ) : (
          <div>
            <p className="brand-name">{data.ingredientName}</p>
          </div>
        )}
        <hr />
      </div>
    </div>
  );
}

export default SearchItem;
