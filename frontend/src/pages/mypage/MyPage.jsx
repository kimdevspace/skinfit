import "./MyPage.scss";
import ToggleButton from "../../components/common/ToggleButton";
import { useMyPageStore, useMyPageInfo } from "../../stores/Mypage";
import axios from 'axios'
import { useQuery } from "@tanstack/react-query"


const fetchTop3Data = async () => {
  const response = await axios.get('/api/v1/user/mypage/bad-ingredient-three')
  return response.data;
};

const useTop3Data = () => {
  return useQuery({
    queryKey : ['top3Data'],
    queryFn : fetchTop3Data
  });
};

function MyPage() {
  // 마이페이지 유저 정보 (스토어) 
  const { setNickname, setSkinTypeId } = useMyPageStore()
  const { data: myinfos, isLoading, isError, error } = useMyPageInfo()
  
  // 성분 top3 데이터
  const { data: top3Data , isLoading, error } = useTop3Data();
  
  
  return (
    <div className="wrapper">
      <div className="edit-user-info">
        <span className="user-name">{myinfos.nickname}</span>
        <span className="user-name2">님</span>
        <div className="user-skin-type">
          {myinfos.skinTypeId.map((skinType, index) => ( 
            <span key={index}>#{skinType} </span>))}
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
          {top3Data.map((top3,index) => (
            <span className="rank-num">{}</span>
            <span className="ingredient-name">{top3.ingredientName}</span>
            <span className="count">{top3.detectionCount}</span>
          ))}
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
