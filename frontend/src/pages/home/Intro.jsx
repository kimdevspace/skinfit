import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.scss";
import { motion, AnimatePresence } from "framer-motion";
import introImg1 from "../../assets/images/intro1.png";
import introImg2 from "../../assets/images/intro2.png";
import introImg3 from "../../assets/images/intro3.png";
import CompletionPopup from "../../components/common/CompletePopUp";

export default function Intro() {
  const [pageNum, setPageNum] = useState(1); // 페이지 넘버 상태 관리
  const navigate = useNavigate();

  // 소개 페이지 별 이미지, 텍스트
  const intro = [
    { img: introImg1, text: "나에게 맞지 않는\n민감 성분 분석이 가능해요" },
    {
      img: introImg2,
      text: "찾고자 하는 화장품이 없나요?\n사진을 찍으면 자동으로 등록돼요",
    },
    {
      img: introImg3,
      text: "내 피부타입에 딱 맞는\n화장품을 추천받을 수 있어요",
    },
  ];

  // 버튼 클릭 핸들러
  const handleIntroBtn = () => {
    if (pageNum < 3) {
      setPageNum(pageNum + 1);
    } else {
      navigate("/auth/login"); // 로그인 페이지로 이동
    }
  };

  return (

    <motion.div
      className="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }} // 페이드 인 시간을 로딩 페이지와 맞춤
    >
      {/* 소개 페이지 번호 박스 */}
      <div className="page-number-box">
        <motion.div
          className="circle"
          whileTap={{ scale: 0.95 }} // 터치할 때 살짝 축소되는 효과
        >
          <motion.p
            className="page-number"
            key={pageNum} // pageNum이 바뀔 때마다 새로운 애니메이션 실행
            initial={{ opacity: 0, y: 20 }} // 처음 위치: 아래쪽 20px + 투명
            animate={{ opacity: 1, y: 0 }} // 최종 위치: 원래 자리 + 불투명
            transition={{ duration: 0.3 }} // 0.3초 동안 실행
          >
            0{pageNum}
          </motion.p>
        </motion.div>
        <div className="line"></div>
      </div>

      {/* 소개 박스 */}
      {/* 이전 컨텐츠가 사라진 후 새 컨텐츠 등장 */}
      <AnimatePresence mode="wait">
        <motion.div
          className="intro-box"
          key={pageNum} // pageNum 변경시 새로운 애니메이션
          initial={{ opacity: 0, x: 50 }} // 처음: 오른쪽 50px + 투명
          animate={{ opacity: 1, x: 0 }} // 최종: 원래 자리 + 불투명
          exit={{ opacity: 0, x: -50 }} // 퇴장: 왼쪽 50px + 투명
          transition={{ duration: 0.4 }} // 0.4초 동안 실행
        >
          <motion.img
            className="intro-img"
            src={intro[pageNum - 1].img}
            alt={`page${pageNum - 1}-img`}
          />
          <motion.p
            className="intro-text"
            initial={{ opacity: 0, y: 20 }} // 처음: 아래쪽 20px + 투명
            animate={{ opacity: 1, y: 0 }} // 최종: 원래 자리 + 불투명
            transition={{ delay: 0.2 }} // 0.2초 후에 시작
          >
            {intro[pageNum - 1].text}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* 다음 또는 시작하기 버튼 */}
      <motion.button
        className="intro-btn"
        onClick={handleIntroBtn}
        whileTap={{ scale: 0.95 }} // 터치할 때 살짝 축소되는 효과
      >
        {pageNum === 3 ? "시작하기" : "다음"}
      </motion.button>
    </motion.div>
  );
}
