import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./AllIngrePopup.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// 전성분 정보 가져오는 api 요청
const fetchAllIngredient = async (cosmeticId) => {
  const response = await axios.get(`/api/v1/${cosmeticId}/all-ingredients`, {
    headers: {
      // 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

function AllIngrePopup({ cosmeticId, closePopup }) {
  // 전성분 정보 가져오기
  const { data: allIngredient, error, isLoading, isError } = useQuery({
    queryKey: ['allIngredient', cosmeticId],
    queryFn : () => fetchAllIngredient(cosmeticId),
    enabled: !!cosmeticId // cosmeticId가 있을 때만 실행
  })

  // api에서 받아온 전성분 데이터
  // const { ingredient } = allIngredient.data

  //#region 전성분 더미데이터
  const ingredient = [
          {
            "ingredient_name": "정제수"
          },
          {
            "ingredient_name": "다이에틸헥실석시네이트"
          },
          {
            "ingredient_name": "프로판다이올"
          },
          {
            "ingredient_name": "테레프탈릴리덴디캠퍼설포닉애씨드"
          },
          {
            "ingredient_name": "카프릴릴메티콘"
          },
          {
            "ingredient_name": "에칠헥실트리아존"
          },
          {
            "ingredient_name": "나이아신아마이드"
          },
          {
            "ingredient_name": "베헤닐알코올"
          },
          {
            "ingredient_name": "디에칠아미노하이드록시벤조일헥실벤조에이트"
          },
          {
            "ingredient_name": "트로메타민"
          },
          {
            "ingredient_name": "1,2-헥산다이올"
          },
          {
            "ingredient_name": "폴리실리콘-15"
          },
          {
            "ingredient_name": "소듐폴리아크릴로일다이메틸타우레이트"
          },
          {
            "ingredient_name": "페닐트라이메티콘"
          },
          {
            "ingredient_name": "비스-에칠헥실옥시페놀메톡시페닐트리아진"
          },
          {
            "ingredient_name": "C14-22알코올"
          },
          {
            "ingredient_name": "C30-45알킬세테아릴다이메티콘크로스폴리머"
          },
          {
            "ingredient_name": "폴리아크릴레이트크로스폴리머-6"
          },
          {
            "ingredient_name": "하이알루로닉애씨드(1,101 ppm)"
          },
          {
            "ingredient_name": "에틸헥실글리세린"
          },
          {
            "ingredient_name": "판테놀"
          },
          {
            "ingredient_name": "C12-20알킬글루코사이드"
          },
          {
            "ingredient_name": "알란토인"
          },
          {
            "ingredient_name": "카프릴릴글라이콜"
          },
          {
            "ingredient_name": "글리세릴카프릴레이트"
          },
          {
            "ingredient_name": "부틸렌글라이콜"
          },
          {
            "ingredient_name": "아데노신"
          },
          {
            "ingredient_name": "글리세린"
          },
          {
            "ingredient_name": "소듐하이알루로네이트(130 ppm)"
          },
          {
            "ingredient_name": "소듐메타포스페이트"
          },
          {
            "ingredient_name": "마데카소사이드"
          },
          {
            "ingredient_name": "글리세릴올리에이트"
          },
          {
            "ingredient_name": "토코페롤"
          },
          {
            "ingredient_name": "레시틴"
          },
          {
            "ingredient_name": "라우릴글루코사이드"
          },
          {
            "ingredient_name": "폴리글리세릴-6라우레이트"
          },
          {
            "ingredient_name": "미리스틸글루코사이드"
          },
          {
            "ingredient_name": "하이드롤라이즈드하이알루로닉애씨드(5 ppm)"
          },
          {
            "ingredient_name": "녹차추출물(4 ppm)"
          },
          {
            "ingredient_name": "소듐하이알루로네이트크로스폴리머(2 ppm)"
          },
          {
            "ingredient_name": "잔탄검"
          },
          {
            "ingredient_name": "소듐아세틸레이티드하이알루로네이트(0.1 ppm)"
          }
        ]
  //#endregion

  // 로딩, 에러 확인
  if (isLoading) {
    return console.log("로딩중", isLoading);
  }
  if (isError) {
    return console.log("에러", isLoading);
  }
  
  
  return (
    <div className="overlay">
      <div className="all-ingredient-popup">
        <button className="close-btn" onClick={closePopup}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <p className="popup-title">전성분 보기</p>
        <div className="all-ingredient">
          {
            ingredient.map((ingre, idx) => (
              <span key={idx}>{ingre.ingredient_name}, </span>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default AllIngrePopup;
