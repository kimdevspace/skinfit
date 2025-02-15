import "./IngredientDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { useUnsuitStore, useUnsuit } from "../../stores/Mypage.js";

export default function IngredientDetail() {
  // 커스텀 훅 사용
  const { isLoading, error } = useUnsuit();

  // Zustand store에서 데이터 가져오기
  const myUnsuits = useUnsuitStore((state) => state.myUnsuits);

  if (isLoading) {
    console.log("성분 데이터 페이지 랜더링 중");
  }

  if (error) {
    console.log("성분 데이터 페이지 랜더링 오류", error.message);
  }

  return (
    <div className="ingredient-detail-wrapper">
      <div className="bad-ingredient-box">
        <div className="title">
          <span>skinfit이 찾은</span>
          <span className="title-color">나와 맞지 않는 성분 랭킹</span>
        </div>
        <div className="bad-ingredient-bar">
          <span className="ingredient-text">성분명</span>
          <span className="count-text">발견횟수</span>
          <div className="text-emoji">
            <span className="status-text">안전등급</span>
            <button>
              <FontAwesomeIcon icon={faCircleQuestion} />
            </button>
          </div>
        </div>
        {myUnsuits &&
          myUnsuits.map((unsuit, index) => (
            <div key={index}>
              <div className="ingredient-list">
                <div className="rank-name">
                  <span className="ingredient-rank">{index + 1}. </span>
                  <span className="ingredient-name">
                    {unsuit.ingredientName}
                  </span>
                  
                </div>
                <div className="ingredient-count">
                  {unsuit.detectionCount}회
                </div>

                <div className="ewg-level-wrapper">
                  {unsuit.ewgScoreMin ? (
                    <>
                      <span className="ewg-level green">
                        {unsuit.ewgScoreMin}
                      </span>
                      <span className="ewg-level">-</span>
                      <span className="ewg-level">{unsuit.ewgScoreMax}</span>
                    </>
                  ) : (
                    <>
                      <span className="ewg-level blank-tag">
                        {unsuit.ewgScoreMax}-
                      </span>
                      <span className="ewg-level">{unsuit.ewgScoreMax}</span>
                    </>
                  )}
                </div>
                <hr />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
