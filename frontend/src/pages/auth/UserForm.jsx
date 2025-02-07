import React, { useState } from "react";
import Header from "../../components/common/Header.jsx";
import UserInfo1 from "../../components/auth/UserInfo1.jsx";
import Category from "../../components/common/Category.jsx";
import Button from "../../components/common/Button.jsx";
import UserInfo2 from "../../components/auth/UserInfo2.jsx";
import {useMutation} from "@tanstack/react-query"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserForm() {
  // ===== 1단계: 기본 회원정보 =====
  const [gender, setGender] = useState("");          
  const [birthYear, setBirthYear] = useState("");      // 문자열로 입력됨 (최종 payload에서는 숫자로 변환)
  const [nickname, setNickname] = useState("");
  const [skinTypes, setSkinTypes] = useState([]);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  // ===== 2단계: 화장품/성분 정보 =====
  const [suitableCosmetics, setSuitableCosmetics] = useState([]);
  const [suitableIngredients, setSuitableIngredients] = useState([]);     
  const [unsuitableCosmetics, setUnsuitableCosmetics] = useState([]);
  const [unsuitableIngredients, setUnsuitableIngredients] = useState([]);

  // 멀티 스텝 관리
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nicknameMutation = useMutation({
    mutationFn: async (payload) => {
      return axios.post("/api/v1/user/nickname-duplicate", payload);
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
      setSkinTypes(skinTypes.filter((id) => id !== type));
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

  // ----- [2단계에서 쓰는 데모 핸들러 & 리스트 예시] -----
  //#region 나와 잘 맞는 화장품 & 성분 데이터 찾기 구현 시 이 부분 수정
  const handleSearch1 = () => {
    // 나에게 잘 맞는 화장품 (필수)
    // setSuitableCosmetics([{ cosmeticId: 2 }, { cosmeticId: 8 }, { cosmeticId: 9 }]);
  };
  const handleSearch2 = () => {
    // 나에게 잘 맞는 성분 (선택)
    // setSuitableIngredients([{ ingredientId: 5 }, { ingredientId: 1 }]);
  };
  const handleSearch3 = () => {
    // 예: 나에게 맞지 않는 화장품 (필수)
    // setUnsuitableCosmetics([{ cosmeticId: 4, symptomIds: [1, 2] }, { cosmeticId: 7, symptomIds: [6] }]);
  };
  const handleSearch4 = () => {
    // 예: 나에게 맞지 않는 성분 (선택)
    // setUnsuitableIngredients([{ ingredientId: 4, symptomIds: [1, 3] }, { ingredientId: 10, symptomIds: [2] }]);
  };
  //#endregion

  const uploadUserInit = async (payload) => {
    return axios.post("/api/v1/user/init", payload);
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
      const payload = {
        gender: gender === "남" ? "MALE" : "FEMALE",
        year: Number(birthYear),
        nickname: nickname,
        skinTypeIds: skinTypes,
        suitableCosmetics: suitableCosmetics,           
        unsuitableCosmetics: unsuitableCosmetics,       
        suitableIngredients: suitableIngredients,     
        unsuitableIngredients: unsuitableIngredients, 
      };
      console.log("최종 payload: ", payload);
      mutation.mutate(payload);
    }
  };

    // ===== UserInfo2의 textarea에 표시할 데이터 포맷 =====
  // 객체 배열을 JSON 문자열 형태로 변환하여 보여줌
  const formatListData = (data) => {
    return data.map((item) => JSON.stringify(item)).join("\n");
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
          {/* 4개의 UserInfo2 컴포넌트를 반복 or 직접 나열 */}
          <UserInfo2
            label="나에게 잘 맞는 화장품 등록(필수)"
            placeholder="나에게 잘 맞는 화장품을 등록해주세요"
            onSearchClick={handleSearch1}
            listData={formatListData(suitableCosmetics)}
          />
          <UserInfo2
            label="나에게 잘 맞는 성분 등록(선택)"
            placeholder="나에게 잘 맞는 성분을 등록해주세요"
            onSearchClick={handleSearch2}
            listData={formatListData(suitableIngredients)}
          />
          <UserInfo2
            label="나에게 맞지 않는 화장품 등록(필수)"
            placeholder="나에게 맞지 않는 화장품을 등록해주세요"
            onSearchClick={handleSearch3}
            listData={formatListData(unsuitableCosmetics)}
          />
          <UserInfo2
            label="나에게 맞지 않는 성분 등록(선택)"
            placeholder="나에게 맞지 않는 성분을 등록해주세요"
            onSearchClick={handleSearch4}
            listData={formatListData(unsuitableIngredients)}
          />

          {/* "완료" 버튼 */}
          <Button text="완료" color="white" onClick={handleNextOrSubmit} />
        </>
      )}
    </div>
  );
}

export default UserForm;
