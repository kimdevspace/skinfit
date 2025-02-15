import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.scss";
import { motion, AnimatePresence } from "framer-motion";
import introImg1 from "../../assets/images/intro1.png";
import introImg2 from "../../assets/images/intro2.png";
import introImg3 from "../../assets/images/intro3.png";

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
    <div className="intro">
      {/* 소개 페이지 번호 박스 */}
      <div className="page-number-box">
        <motion.div className="circle" whileTap={{ scale: 0.95 }}>
          <motion.p
            className="page-number"
            key={pageNum}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            0{pageNum}
          </motion.p>
        </motion.div>
        <div className="line"></div>
      </div>

      {/* 소개 박스 */}
      <AnimatePresence mode="wait">
        <motion.div
          className="intro-box"
          key={pageNum}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <motion.img
            className="intro-img"
            src={intro[pageNum - 1].img}
            alt={`page${pageNum - 1}-img`}
          />
          <motion.p
            className="intro-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {intro[pageNum - 1].text}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* 다음 또는 시작하기 버튼 */}
      <motion.button
        className="intro-btn"
        onClick={handleIntroBtn}
        whileTap={{ scale: 0.95 }}
      >
        {pageNum === 3 ? "시작하기" : "다음"}
      </motion.button>
    </div>
  );
}
