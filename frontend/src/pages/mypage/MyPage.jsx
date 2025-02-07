import "./MyPage.scss";
import ToggleButton from "../../components/common/ToggleButton";

function MyPage() {
  return (
    <div className="wrapper">
      <div className="edit-user-info">
        <span className="user-name">먀먀</span>
        <span className="user-name2">님</span>
        <div className="user-skin-type">
          <span>#건성 </span>
          <span>#민감성 </span>
        </div>
        <div>
          <button className="edit-info-btn">내 정보 수정하기</button>
        </div>
      </div>

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
          <span className="count">9</span>
          <span className="count2">/10개</span>
        </div>
        <div className="ingredient-detail-btn">
          <button className="detail-btn">성분 자세히 보기</button>
        </div>
      </div>

      <div className="cosmetic-wrapper">
        <h2>내가 등록한 화장품</h2>
        <div className="set-position">
          <ToggleButton btn1="맞는 화장품" btn2="맞지 않는 화장품" />
          <button className="edit-del-btn">수정</button>
        </div>
        <div className="cosmetic-list">
          <span className="cosmetic-name">달바 미스트 에어퍼퓸 100ml</span>
          <img src="" alt="" />
        </div>
        <hr />
      </div>

      <div className="review-wrapper">
        <h2>리뷰 목록</h2>
        <ToggleButton btn1="내가 좋아요한 리뷰" btn2="내가 작성한 리뷰" />
      </div>
      <hr className="hr-line" />
      <p>회원탈퇴</p>
    </div>
  );
}

export default MyPage;
