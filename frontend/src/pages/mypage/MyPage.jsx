import "./MyPage.scss";
h;
function MyPage() {
  return (
    <>
      <div className="edit-user-info">
        <div className="user-name">먀먀님</div>
        <div className="user-skin-type">
          <span>#건성 </span>
          <span>#민감성 </span>
        </div>
        <div>
          <button className="edit-info-btn">내 정보 수정하기</button>
        </div>
      </div>

      <div className="top3-behind-box"></div>

      <div className="top3-box-wrapper">

        <div className="top3-box">
          <div className="title">
            <h2>나와 맞지 않는 성분 TOP 3</h2>
            <p className="question-text">
              내가 등록한 화장품에서 얼마나 발견됐을까?
            </p>
          </div>
          <hr />
          <div className="ranking-text">
            <span className="rank-num">1</span>
            <span className="ingredient-name">아밀신남알</span>
            <span className="count">9/10개</span>
          </div>
          <div className="ingredient-detail-btn">
            <button className="detail-btn">성분 자세히 보기</button>
          </div>
        </div>
      </div>

      <div className="cosmetic-wrapper">
        <h2>내가 등록한 화장품</h2>
      </div>
    </>
  );
}

export default MyPage;
