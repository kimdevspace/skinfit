import "./MyPage.scss"
import ToggleButton from "../../components/common/ToggleButton"
import { useMyPageInfo, useTop3Data, useMyCosmetics, useMyIngredients, useMyReviews } from "../../stores/Mypage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"
import ReviewItem from "../../components/review/ReviewItem"

function MyPage() {
  //1. 스토어 데이터 불러오기
  // 마이페이지 유저 정보 불러오기
  const { data: myinfos } = useMyPageInfo()

  // 성분 top3 데이터
  const { data: top3Data } = useTop3Data()

  // 내가 등록한 화장품 데이터
  const { data: myCosmetics } = useMyCosmetics()

  // 성분 데이터
  const { data: myIngredients } = useMyIngredients()

  // 리뷰 데이터
  const { data: myReviews } = useMyReviews()

  //2. 액션 감지
  // 리뷰 토글 버튼 감지
  const [showLikedReviews, setShowLikedReviews] = useState(true)
  const reviewHandler= () => {
      
    setShowLikedReviews(true)
    console.log('메인페이지에서 감지',showLikedReviews)
  };
  

  return (
    <div className="wrapper">
      {/* 유저 닉네임, 피부타입 정보 */}
      <div className="edit-user-info">
        <span className="user-name">{myinfos?.nickname}</span>
        <span className="user-name2">님</span>
        <div className="user-skin-type">{myinfos && myinfos.skinTypeId.map((skinType, index) => <span key={index}>#{skinType} </span>)}</div>
        <div>
          <button className="edit-info-btn">내 정보 수정하기</button>
        </div>
      </div>

      {/* 랭킹 3 정보 */}
      <div className="top3-box">
        <div className="title">
          <span>skinfit이 찾은 </span>
          <span className="color-text">나와 맞지 않는 성분 TOP 3</span>
        </div>
        <hr />
        <div className="ranking-text">
          {Array.isArray(top3Data) &&
            top3Data.map((top3, index) => (
              <div key={index}>
                <span className="rank-num">{index + 1}</span>
                <span className="ingredient-name">{top3.ingredientName}</span>
              </div>
            ))}
        </div>
        <div className="ingredient-detail-btn">
          <Link to="/ingredients" className="detail-btn">
            성분 자세히 보기
          </Link>
        </div>
      </div>

      {/* 내가 등록한 화장품 정보 */}
      <div className="cosmetic-wrapper">
        <h2>내가 등록한 화장품</h2>
        <div className="set-position">
          <ToggleButton btn1="맞는 화장품" btn2="맞지 않는 화장품" />
          <button className="edit-del-btn">수정</button>
        </div>
        <div className="cosmetic-list">
          <span className="cosmetic-name">{}</span>
          <img src="" alt="" />
        </div>
        <hr />
      </div>

      {/* 내가 등록한 성분분 정보 */}
      <div className="my-ingredient-box">
        <h2>내가 등록한 성분</h2>
        <div className="set-position">
          <ToggleButton btn1="맞는 성분" btn2="맞지 않는 성분" />
          <button className="edit-del-btn">수정</button>
        </div>
        <div className="ingredient-list">
          <div className="ingredient-name">아말신남알</div>
          <div className="ewg-level">-</div>
        </div>
        <hr />
      </div>

      {/* 리뷰 목록 */}
      <div className="review-wrapper">
        <h2>리뷰 목록</h2>
        <ToggleButton btn1="내가 좋아요한 리뷰" btn2="내가 작성한 리뷰" onClick={reviewHandler}/>
        {myReviews && <ReviewItem reviews={showLikedReviews ? myReviews.likedReviews : myReviews.myReviews} />}
      </div>

      {/* 회원탈퇴 */}
      <hr className="hr-line" />
      <p className="signout">회원탈퇴</p>
    </div>
  )
}

export default MyPage
