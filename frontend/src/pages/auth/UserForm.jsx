import React, { useState } from "react";
import Header from "../../components/common/Header.jsx";
import UserInfo1 from "../../components/auth/UserInfo1.jsx";
import Category from "../../components/common/Category.jsx";
import Button from "../../components/common/Button.jsx";
import UserInfo2 from "../../components/auth/UserInfo2.jsx";
import { useMutation } from "@tanstack/react-query";
import axios from "../../api/axiosInstance.js";
import { useNavigate } from "react-router-dom";
import { useSearchPopupStore } from "../../stores/SearchPopup.js";
import SearchPopup from "../../components/search/SearchPopup.jsx";

function UserForm() {
  // ===== 1단계: 기본 회원정보 =====
  const [gender, setGender] = useState("");
  const [birthYear, setBirthYear] = useState(""); // 문자열로 입력됨 (최종 payload에서는 숫자로 변환)
  const [nickname, setNickname] = useState("");
  const [skinTypes, setSkinTypes] = useState([]);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  // 멀티 스텝 관리
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nicknameMutation = useMutation({
    mutationFn: async (payload) => {
      return axios.post("user/nickname-duplicate", payload);
    },
    onSuccess: (response) => {
      // response.data에 응답 메시지가 있다고 가정합니다.
      alert(response.data);
      setNicknameChecked(true);
    },
    onError: () => {
      alert("닉네임 중복 확인 중 오류가 발생했습니다.");
      setNicknameChecked(false);
    },
  });

  const handleNicknameChange = (value) => {
    setNickname(value);
    setNicknameChecked(false);
  };

  // 닉네임 중복확인
  const handleNicknameCheck = () => {
    nicknameMutation.mutate({ nickname });
  };

  // 피부타입 토글
  const toggleSkinType = (typeId) => {
    if (skinTypes.includes(typeId)) {
      setSkinTypes(skinTypes.filter((id) => id !== typeId));
    } else {
      setSkinTypes([...skinTypes, typeId]);
    }
  };

  // 뒤로가기 버튼 클릭
  const handleBack = () => {
    console.log("뒤로가기 클릭");
    // 필요 시 step을 1로 되돌리거나, 라우터 navigate(-1) 등
    if (step === 2) {
      setStep(1);
    } else {
      // 다른 로직
    }
  };

  // 스토어에서 getApiPayload 함수와 items 가져오기
  const { getApiPayload, items } = useSearchPopupStore();

  // SearchPopup 상태 관리
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [searchPopupProps, setSearchPopupProps] = useState(null);

  // 검색 팝업 열기
  const handleSearch = (category) => {
    const props = {
      type: category.includes("Cosmetics") ? "cosmetic" : "ingredient",
      suitability: category.includes("unsuitable") ? "unsuitable" : "suitable",
      category: category,
    };
    setSearchPopupProps(props);
    setIsSearchPopupOpen(true); // 팝업 열기
  };

  // 검색 팝업 닫기
  const handleClosePopup = () => {
    setIsSearchPopupOpen(false); // 팝업 닫기
    // props는 유지 (다음에 같은 카테고리 검색할 때 사용)
  };

  const uploadUserInit = async (payload) => {
    return axios.post("user/init", payload);
  };

  const mutation = useMutation({
    mutationFn: uploadUserInit,
    onSuccess: () => {
      alert("회원 정보 등록에 성공했습니다.");
      navigate("/");
    },
    onError: () => {
      alert("회원 정보 등록 중 오류가 발생했습니다.");
    },
  });

  // 다음 버튼(1단계) / 완료 버튼(2단계)
  const handleNextOrSubmit = () => {
    if (step === 1) {
      // 1단계 데이터 확인 후 2단계로 이동
      if (!nicknameChecked) {
        alert("닉네임 중복확인을 해주세요!");
        return;
      }
      const step1Data = { gender, birthYear, nickname, skinTypes };
      console.log("1단계 입력 데이터: ", step1Data);
      setStep(2);
    } else if (step === 2) {
      // 필수 항목 체크
      if (
        !items.suitableCosmetics.length ||
        !items.unsuitableCosmetics.length
      ) {
        alert("잘 맞는 화장품과 맞지 않는 화장품은 필수로 등록해야 합니다.");
        return;
      }

      const payload = {
        gender: gender === "남" ? "MALE" : "FEMALE",
        year: Number(birthYear),
        nickname: nickname,
        skinTypeIds: skinTypes,
        ...getApiPayload(), // 스토에의 변환 함수 사용
      };
      console.log("최종 payload: ", payload);
      mutation.mutate(payload);
    }
  };

  return (
    <div className="user-form-container">
      <Header title="회원정보 입력" onBack={handleBack} />

      {step === 1 && (
        <>
          <div className="form-section">
            {/* 성별, 출생연도, 닉네임 */}
            <UserInfo1
              gender={gender}
              setGender={setGender}
              birthYear={birthYear}
              setBirthYear={setBirthYear}
              nickname={nickname}
              setNickname={handleNicknameChange}
              onNicknameCheck={handleNicknameCheck}
            />

            {/* 피부타입 (중복선택) */}
            <Category skinTypes={skinTypes} onToggleType={toggleSkinType} />
          </div>

          {/* "다음" 버튼 */}
          <Button text="다음" color="white" onClick={handleNextOrSubmit} />
        </>
      )}

      {step === 2 && (
        <>
          <UserInfo2
            label="나에게 잘 맞는 화장품 등록(필수)"
            placeholder="나에게 잘 맞는 화장품을 등록해주세요"
            onSearchClick={handleSearch}
            category="suitableCosmetics"
          />
          <UserInfo2
            label="나에게 잘 맞는 성분 등록(선택)"
            placeholder="나에게 잘 맞는 성분을 등록해주세요"
            onSearchClick={handleSearch}
            category="suitableIngredients"
          />
          <UserInfo2
            label="나에게 맞지 않는 화장품 등록(필수)"
            placeholder="나에게 맞지 않는 화장품을 등록해주세요"
            onSearchClick={handleSearch}
            category="unsuitableCosmetics"
          />
          <UserInfo2
            label="나에게 맞지 않는 성분 등록(선택)"
            placeholder="나에게 맞지 않는 성분을 등록해주세요"
            onSearchClick={handleSearch}
            category="unsuitableIngredients"
          />

          <Button text="완료" color="white" onClick={handleNextOrSubmit} />

          {/* 검색 팝업 */}
          {isSearchPopupOpen && searchPopupProps && (
            <SearchPopup {...searchPopupProps} onClose={handleClosePopup} />
          )}
        </>
      )}
    </div>
  );
}

export default UserForm;
