// 검색완료 컴포넌트
import "./SearchItem.scss";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {useState, useEffect} from 'react';

// 화면 너비에 따라 다른 최대 길이 설정
const getTruncateLength = () => {
  return window.innerWidth >= 570 ? 30 : 15;
};

// 제품명 임의로 15글자 이상일 때 .. 처리
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "..";
  }
  return text;
};

// key : cosmeticId || indgredientId
// data : item
// 검색완료 컴포넌트

// 화장품 상세 정보 조회 함수
const fetchCosmeticDetail = async (cosmeticId) => {
  try {
    const response = await axios.get(`cosmetic/${cosmeticId}`);
    return response.data;
  } catch (error) {
    throw new Error("화장품 상세 정보를 가져오는데 실패했습니다.");
  }
};

function SearchItem({ idType, data }) {

  const [maxLength, setMaxLength] = useState(getTruncateLength());

  console.log("검색페이지 검색된 data 잘전달됨", data);
  const navigate = useNavigate();

  const { refetch } = useQuery({
    queryKey: ["cosmeticDetail", idType],
    queryFn: () => fetchCosmeticDetail(idType),
    enabled: false, // 자동 실행 방지
  });

  const moveToDetail = async () => {
    try {
      await refetch();
      navigate(`/cosmetics/${idType}`);
    } catch (error) {
      console.error("상세 정보 페이지로 이동 중 오류 발생:", error);
    }
  };

  // 화면 크기 변경 시 truncate 길이 업데이트
  useEffect(() => {
    const handleResize = () => {
      setMaxLength(getTruncateLength());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="margin-setting">
      <div className="search-wrapper" onClick={moveToDetail}>
        <img
          className="cosmetic-image"
          src={data.imageUrl}
          alt="cosmetic_product_image"
        />
        <div className="cosmetic-box">
          <p className="brand-name">{data.cosmeticBrand}</p>
         <p className="cosmetic-name">{truncateText(data.cosmeticName, maxLength)}</p>
        </div>
        {/* 안전/유의 뱃지 */}
        <div className="badge">
          <div className={`badge ${data.safetyStatus ? "isSafe" : "isWarned"}`}>
            { data.safetyStatus ? '안전' : '유의'}
          </div>
        </div>
      </div>
      <hr className="search-hr" />
    </div>
  );
}

export default SearchItem;
