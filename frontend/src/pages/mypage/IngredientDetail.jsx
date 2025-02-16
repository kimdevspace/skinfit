import "./IngredientDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { useUnsuitStore, useUnsuit } from "../../stores/Mypage.js";
import img1 from "../../assets/images/ingredient_example_1.png";
import img2 from "../../assets/images/ingredient_example_2.png";
import img3 from "../../assets/images/ingredient_example_3.png";
import { useState } from "react";
import bttn1 from "../../assets/images/carousel_bttn1.png";
import bttn2 from "../../assets/images/carousel_bttn2.png";



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

  // 현재 보여지는 이미지의 인덱스를 관리하는 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  // 애니메이션 진행 중임을 나타내는 상태
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      image: img1,
      title: "1. 내가 등록한 화장품 목록에서 성분 추출"
    },
    {
      image: img2,
      title: "2. 내 피부에 맞지 않는 성분 분석"
    },
    {
      image: img3,
      title: "3. 내가 등록한 맞지 않는 화장품에서 발견된 횟수 분석"
    }
  ];
 

  // 이전 이미지로 이동하는 핸들러
  const handlePrev = () => {
    // 애니메이션 진행 중이면 추가 클릭 방지
    if (isAnimating) return;
    // 애니메이션 상태 활성화
    setIsAnimating(true);
    // 현재 인덱스를 업데이트. 첫 번째 이미지에서 이전을 누르면 마지막 이미지로
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
    // 750ms 후에 애니메이션 상태 비활성화
    setTimeout(() => setIsAnimating(false), 750);
  };

  // 다음 이미지로 이동하는 핸들러
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    // 현재 인덱스를 업데이트. 마지막 이미지에서 다음을 누르면 첫 번째 이미지로
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 750);
  };

  return (
    <div className="font-name">
      <div className="title">
        <span className="title-color">나와 맞지않는 성분 랭킹</span>
        <span>이렇게 찾아요!</span>
      </div>
      {/* <hr className='title-hr'/> */}


      {/* // 캐러셀 컨테이너 */}
      <div className="carousel-container">
  <button 
    className="carousel-button prev"
    onClick={handlePrev}
    disabled={isAnimating}
  >
    <img className='carousel-bttn' src={bttn1} alt="bttn" />
  </button>
  
  <div className="carousel-content">
    <div 
      className="carousel-track"
      style={{ 
        transform: `translateX(-${currentIndex * 100}%)`,
      }}
    >
      {slides.map((slide, index) => (
        <div key={index} className="carousel-slide">
          <h3 className="carousel-title">{slide.title}</h3>
          <div className={`carousel-image-wrapper ${isAnimating ? 'animating' : ''}`}>
            <img 
              src={slide.image} 
              alt={`slide ${index + 1}`}
              className="carousel-image"
            />
          </div>
        </div>
      ))}
    </div>
  </div>

  <button 
    className="carousel-button next"
    onClick={handleNext}
    disabled={isAnimating}
  >
    <img className='carousel-bttn' src={bttn2} alt="bttn" />
  </button>

  <div className="carousel-indicators">
    {slides.map((_, index) => (
      <div
        key={index}
        className={`indicator ${currentIndex === index ? 'active' : ''}`}
      />
    ))}
  </div>
</div>

      {/* ---------------------------랭킹 표 */}
      <div className="ingredient-detail-wrapper">
        <div className="bad-ingredient-box">
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
    </div>
  );
}
