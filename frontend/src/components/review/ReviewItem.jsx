import "./ReviewItem.scss";
import thumbsUpEmoji from "../../assets/images/thumsUp.png";
import ReviewComplaintPopup from "./ReviewComplaintPopup";

export default function ReviewItem() {
  return (
    <>
      <div className="review-box">
        <p className="cosmetic-name">달바 트러플 뇨끼 100ml </p>

        <div className="user-info-section">
          <span className="user-name">안녕하하님</span>
          <div className="age-skintype">
            <span className="user-age">20대 |</span>
            <span className="user-skintype"> 복합성 민감성</span>
          </div>
          <span className="user-answer good"> GOOD</span>
        </div>
        <hr />
        <div className="review-content">
          이거 바르고 많이 좋아짐 강추강추강추추~
          <img className="review-photo" src="" alt="user-review-photo" />
          <div className="btn-set">
            <button className="liked-btn">
              <img src={thumbsUpEmoji} alt="liked-btn" className="emoji" />
              15개
            </button>
            <button className="report-btn">신고  | 25.02.11</button>
          </div>
        </div>
      </div>
      <ReviewComplaintPopup />
    </>
  );
}
