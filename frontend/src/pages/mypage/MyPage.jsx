import "./MyPage.scss";
import ToggleButton from "../../components/common/ToggleButton";
import {
  useMyPageInfo,
  useMyPageStore,
  useTop3Data,
  useTop3DataStore,
  useMyCosmetics,
  useMyCosmeticsStore,
  useMyIngredients,
  useMyIngredientsStore,
  useReviews,
  useReviewsStore,
} from "../../stores/Mypage";
import { useState, useEffect } from "react";
import ReviewItem from "../../components/review/ReviewItem";
import PwCheckPopUp from "../../components/auth/PwCheckPopUp";
import { Link } from "react-router-dom";
import SearchPopup from "../../components/search/SearchPopup";
import NavBar from "../../components/common/NavBar";
import Header from "../../components/common/Header.jsx";
import { useNavigate } from "react-router-dom";

function MyPage() {
  // UI 상태 변수
  const [editPopupProps, setEditPopupProps] = useState(null);
  const [isCosmeticClicked, setIsCosmeticClicked] = useState("맞는 화장품");
  const [isIngredientClicked, setIsIngredientClicked] = useState("맞는 성분");
  const [isReviewClicked, setReviewIsClicked] = useState("내가 좋아요한 리뷰");
  const [isWithdrawOpen, setWithdrawIsOpen] = useState(false);
  const [isMyInfoOpen, setyMyInfoOpen] = useState(false);

  // React Query와 zustand를 이용해 데이터 가져오기
  const { error: error1, isLoading } = useMyPageInfo();
  const myInfos = useMyPageStore((state) => state.myInfos);

  const { isLoading: top3Loading, error: top3Error } = useTop3Data();
  const top3Data = useTop3DataStore((state) => state.top3Data);

  const { error: cosError, refetch: refetchCosmetics } = useMyCosmetics();
  const myMatchedCosData = useMyCosmeticsStore(
    (state) => state.myMatchedCosData
  );
  const myUnMatchedCosData = useMyCosmeticsStore(
    (state) => state.myUnMatchedCosData
  );

  const { error: ingError, refetch: refetchIngredients } = useMyIngredients();
  const myMatchedIngreData = useMyIngredientsStore(
    (state) => state.myMatchedIngreData
  );
  const myUnMatchedIngreData = useMyIngredientsStore(
    (state) => state.myUnMatchedIngreData
  );

  const { error: reviewError, refetch: refetchReviews } = useReviews();
  const myReviews = useReviewsStore((state) => state.myReviews);
  const likedReviews = useReviewsStore((state) => state.likedReviews);


  // myInfos 변경 시 로그 출력 (스토어 업데이트 확인)
  useEffect(() => {
    console.log("useEffect - myInfos 업데이트:", myInfos);
    console.log('likedReviews',likedReviews)
    console.log('myReviews',myReviews)
  }, [myInfos, likedReviews,myReviews]);

  // 수정 후 데이터 새로고침을 위한 useEffect
  useEffect(() => {
    if (editPopupProps === null) {
      // 모든 데이터 새로고침
      refetchCosmetics();
      refetchIngredients();
      refetchReviews();

      console.log("팝업 닫힘 감지: 데이터 새로고침 실행");
    }
  }, [editPopupProps, refetchCosmetics, refetchIngredients, refetchReviews]);
  const navigate = useNavigate();

  if (error1) {
    console.log("마이페이지 유저 데이터 렌더링 오류:", error1.message);
  }

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  // 핸들러들
  const handleBack = () => {
    navigate(-1);
  };

  const cosmeticHandler = (text) => {
    setIsCosmeticClicked(text);
    console.log("화장품 토글:", text);
  };

  const ingredientHandler = (text) => {
    setIsIngredientClicked(text);
    console.log("성분 토글:", text);
  };

  const reviewHandler = (text) => {
    setReviewIsClicked(text);
    console.log("리뷰 토글:", text);
  };

  const handleWithdrawPopup = () => {
    setWithdrawIsOpen((prev) => !prev);
  };

  return (
    <>
      <Header title="마이페이지" onBack={handleBack} />
      <div className="wrapper">
        {/* 유저 정보 영역 */}
        <div className="edit-user-info">
          <span className="user-name">{myInfos?.nickname}</span>
          <span className="user-name2">님</span>
          <div className="user-skin-type">
            {myInfos?.userSkinTypes?.map((skinType, index) => (
              <span key={index}>#{skinType} </span>
            ))}
          </div>
          <div>
            <button
              className="edit-info-btn"
              onClick={() => setyMyInfoOpen((prev) => !prev)}
            >
              내 정보 수정하기
            </button>
            {isMyInfoOpen && (
              <PwCheckPopUp
                onClose={() => setyMyInfoOpen(false)}
                state="myinfo"
              />
            )}
          </div>
        </div>

        {/* Top3 영역 */}
        <div className="top3-box">
          <div className="title">
            <span>skinfit이 찾은 </span>
            <span className="color-text">나와 맞지 않는 성분 TOP 3</span>
          </div>
          <hr className="item-line" />
          <div className="ranking-text">
            {Array.isArray(top3Data) &&
              top3Data.map((ingredient) => (
                <div key={ingredient}>
                  <span className="rank-num">
                    {top3Data.indexOf(ingredient) + 1}
                  </span>
                  <span className="ingredient-name">{ingredient}</span>
                </div>
              ))}
          </div>
          <div className="ingredient-detail-btn">
            <Link to="/mypage/ingredient" className="detail-btn">
              랭킹 더보기
            </Link>
          </div>
        </div>

        {/* 내가 등록한 화장품 영역 */}
        <div className="cosmetic-wrapper">
          <h2>내가 등록한 화장품</h2>
          <div className="set-position">
            <ToggleButton
              text1="맞는 화장품"
              text2="맞지 않는 화장품"
              handler={cosmeticHandler}
            />
            <button
              className="edit-del-btn"
              onClick={() =>
                setEditPopupProps({
                  type: "cosmetic",
                  suitability:
                    isCosmeticClicked === "맞는 화장품"
                      ? "suitable"
                      : "unsuitable",
                  category:
                    isCosmeticClicked === "맞는 화장품"
                      ? "suitableCosmetics"
                      : "unsuitableCosmetics",
                  onClose: () => setEditPopupProps(null),
                  isEdit: true,
                })
              }
            >
              수정
            </button>
          </div>
          <div>
            {(isCosmeticClicked === "맞는 화장품"
              ? myMatchedCosData
              : myUnMatchedCosData
            )?.map((cos) => (
              <div key={cos.id} className="cosmetic-item-wrapper">
                <div className="cosmetic-item">
                  <span className="cosmetic-name">{cos.cosmeticName}</span>
                  <img src={cos.imageUrl || ""} alt={cos.cosmeticName} />
                </div>
                <hr className="item-line" />
              </div>
            ))}
          </div>
        </div>

        {/* 내가 등록한 성분 영역 */}
        <div className="my-ingredient-box">
          <h2>내가 등록한 성분</h2>
          <div className="set-position">
            <ToggleButton
              text1="맞는 성분"
              text2="맞지 않는 성분"
              handler={ingredientHandler}
            />
            <button
              className="edit-del-btn"
              onClick={() =>
                setEditPopupProps({
                  type: "ingredient",
                  suitability:
                    isIngredientClicked === "맞는 성분"
                      ? "suitable"
                      : "unsuitable",
                  category:
                    isIngredientClicked === "맞는 성분"
                      ? "suitableIngredients"
                      : "unsuitableIngredients",
                  onClose: () => setEditPopupProps(null),
                  isEdit: true,
                })
              }
            >
              수정
            </button>
          </div>
          <div>
            {(isIngredientClicked === "맞는 성분"
              ? myMatchedIngreData
              : myUnMatchedIngreData
            )?.map((ing) => (
              <div key={ing.ingredientId}>
                <div className="ingredient-list">
                  <div className="ingredient-name">{ing.ingredientName}</div>
                  {ing.ewgScoreMin !== 0 ? (
                    <div
                      className={`ewg-level ${
                        ing.ewgScoreMin <= 2
                          ? "green"
                          : ing.ewgScoreMin <= 6
                          ? "orange"
                          : "red"
                      }`}
                    >
                      {ing.ewgScoreMin} - {ing.ewgScoreMax}
                    </div>
                  ) : ing.ewgScoreMax !== 0 ? (
                    <div
                      className={`ewg-level ${
                        ing.ewgScoreMax <= 2
                          ? "green"
                          : ing.ewgScoreMax <= 6
                          ? "orange"
                          : "red"
                      }`}
                    >
                      {ing.ewgScoreMax}
                    </div>
                  ) : (
                    <div>-</div>
                  )}
                </div>
                <hr className="item-line" />
              </div>
            ))}
          </div>
        </div>

        {/* 검색 팝업창 */}
        {editPopupProps && <SearchPopup {...editPopupProps} />}

        {/* 리뷰 영역 */}
        <div className="review-wrapper">
          <h2>리뷰 목록</h2>
          <ToggleButton
            text1="내가 좋아요한 리뷰"
            text2="내가 작성한 리뷰"
            handler={reviewHandler}
          />
          <div>
            {isReviewClicked === "내가 좋아요한 리뷰"
              ? likedReviews?.map((review) => (
                  <ReviewItem
                    key={review.reviewId}
                    review={review}
                    reviewType="likedReviews"
                  />
                ))
              : myReviews?.map((review) => (
                  <ReviewItem
                    key={review.reviewId}
                    review={review}
                    reviewType="myReviews"
                  />
                ))}
          </div>
        </div>

        {/* 회원탈퇴 영역 */}
        <hr className="hr-line" />
        <div>
          <p className="signout" onClick={handleWithdrawPopup}>
            회원탈퇴
          </p>
          {isWithdrawOpen && (
            <PwCheckPopUp onClose={handleWithdrawPopup} state="withdraw" />
          )}
        </div>
      </div>
      <NavBar />
    </>
  );
}

export default MyPage;
