import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AllIngrePopup from "../../components/cosmetics/AllIngrePopup";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import CosmeticInfo from "../../components/cosmetics/CosmeticInfo";

// 화장품 정보 요청 함수
const fetchCosmeticDetails = async (cosmeticId) => {
  const response = await axios.get(`/api/v1/cosmetics/${cosmeticId}`, {
    headers: {
      // 'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.cosmetic;
};

function CosmeticDetail() {
  const { cosmeticId } = useParams(); // 화장품 id 파라미터

  // 화장품 정보 요청
  // const { data: cosmeticData, isLoading } = useQuery({
  //   queryKey: ["cosmetic", cosmeticId],
  //   queryFn: () => fetchCosmeticDetails(cosmeticId),
  // });

  // #region 화장품 정보 더미 데이터
  const cosmeticData = {
    cosmeticId: 123,
    cosmeticName: "스킨 토너",
    cosmeticBrand: "브랜드 A",
    category: "스킨케어",
    imageUrl: "https://example.com/images/product123.jpg",
    ingredients: [
      {
        "ingredient_name": "히알루론산",
        "ewg_score_max": 2,
        "ewg_score_min": null,
        "found_count": 2 // 내가 써본 화장품에서 발견된 횟수
      },
      {
        "ingredient_name": "카세늠듐",
        "ewg_score_max": 3,
        "ewg_score_min": 1,
        "found_count": 1 // 내가 써본 화장품에서 발견된 횟수
      },
      {
        "ingredient_name": "히알루론산",
        "ewg_score_max": 7,
        "ewg_score_min": null,
        "found_count": 0 // 내가 써본 화장품에서 발견된 횟수
      }
    ],
  };
  //#endregion

  // #region 전성분 보기 팝업창
  // 전성분 팝업창 제어
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 전성분 팝업 열기
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // 전성분 팝업 닫기
  const closePopup = () => {
    setIsPopupOpen(false);
  };
  // #endregion

  return (
    <div className="cosmetic-detail">
      <Header title="상세 정보" />

      <CosmeticInfo cosmeticData={cosmeticData} />

      <Button text="전성분 보기" color="white" onClick={openPopup} />
      {isPopupOpen && <AllIngrePopup closePopup={closePopup} />}
    </div>
  );
}

export default CosmeticDetail;
