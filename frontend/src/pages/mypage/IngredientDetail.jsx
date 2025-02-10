import "./IngredientDetail.scss"
import ToggleButton from "../../components/common/ToggleButton"

export default function IngredientDetail() {
  return (
    <div className="ingredient-detail-wrapper">
      <div className="bad-ingredient-box">
        <h2>나와 맞지 않는 성분</h2>
        <div className="bad-ingredient-bar">
          <span className="bar-text">성분명</span>
          <span className="bar-text">안전등급</span>
        </div>
        <div className="ingredient-list">
          <div className="ingredient-name">아말신남알</div>
          <div className="ewg-level">7</div>
        </div>
        <hr />
      </div>

    </div>
  )
}
