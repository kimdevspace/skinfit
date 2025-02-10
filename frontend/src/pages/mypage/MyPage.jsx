import "./MyPage.scss"
import ToggleButton from "../../components/common/ToggleButton"
import { useMyPageStore, useMyPageInfo } from "../../stores/Mypage"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"
import ReviewItem from '../../components/review/ReviewItem'

// top3 데이터 불러오기기
const fetchTop3Data = async () => {
  const response = await axios.get("/api/v1/user/mypage/bad-ingredient-three")
  return response.data
}

const useTop3Data = () => {
  return useQuery({
    queryKey: ["top3Data"],
    queryFn: fetchTop3Data,
    onSuccess: (data) => {
      console.log("TOP3 데이터 조회완료", data)
    },
    onError: (error) => {
      console.error("top3 성분 조회 에러", error)
    },
  })
}

// 내가 등록한 화장품 목록 불러오기 
const fetchMyCosmetics = async () => {
  const response = await axios.get("/api/v1/users/mypage/cosmetics")
  return response.data.cosmetics
}

const useMyCosmetics = () => {
  return useQuery({
    queryKey: ["myCosmetics"],
    queryFn: fetchMyCosmetics,
    onSuccess: (data) => {
      console.log("내가 등록한 데이터 조회완료", data)
    },
    onError: (error) => {
      console.error("내가 등록한 데이터 조회 에러", error)
    },
  })
}


function MyPage() {
  // 마이페이지 유저 정보 불러오기
  const { data: myinfos } = useMyPageInfo()

  // 성분 top3 데이터
  const { data: top3Data } = useTop3Data()

  // 내가 등록한 화장품 데이터 
  const { data: myCosmetics } = useMyCosmetics()

  return (
    <div className="wrapper">
      <div className="edit-user-info">
        <span className="user-name">{myinfos?.nickname}</span>
        <span className="user-name2">님</span>
        <div className="user-skin-type">
          { myinfos && myinfos.skinTypeId.map((skinType, index) => (
            <span key={index}>#{skinType} </span>
          ))}
        </div>
        <div>
          <button className="edit-info-btn">내 정보 수정하기</button>
        </div>
      </div>

      <div className="top3-box">
        <div className="title">
          <h2>나와 맞지 않는 성분 TOP 3</h2>
          <p className="question-text">내가 등록한 화장품에서 얼마나 발견됐을까?</p>
        </div>
        <hr />
        <div className="ranking-text">
            { Array.isArray(top3Data) && top3Data.map((top3, index) => (
              <div key={index}>
              <span className="rank-num">{index + 1}</span>
              <span className="ingredient-name">{top3.ingredientName}</span>
              <span className="count">{top3.detectionCount}</span>
              <span className="count2">/10개</span>
              </div>
          ))}

        </div>
        <div className="ingredient-detail-btn">
          <Link to="/ingredients" className="detail-btn">
            성분 자세히 보기
          </Link>
        </div>
      </div>

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

      <div className="review-wrapper">
        <h2>리뷰 목록</h2>
        <ToggleButton btn1="내가 좋아요한 리뷰" btn2="내가 작성한 리뷰" />
        <ReviewItem />
      </div>
      <hr className="hr-line" />
      <p className="signout">회원탈퇴</p>
    </div>
  )
}

export default MyPage
