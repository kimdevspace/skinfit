import React, { useState } from "react";
import Header from "../../components/common/Header.jsx";
import UserInfo1 from "../../components/auth/UserInfo1.jsx";
import Category from "../../components/common/Category.jsx";
import Button from "../../components/common/Button.jsx";
import UserInfo2 from "../../components/auth/UserInfo2.jsx";

function UserForm() {
  // 멀티 스텝 관리
  const [step, setStep] = useState(1);

  // ----- [1단계에서 쓰는 상태들] -----
  const [gender, setGender] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [nickname, setNickname] = useState("");
  const [skinTypes, setSkinTypes] = useState([]);

  // ----- [2단계에서 쓰는 데모 핸들러 & 리스트 예시] -----
  const handleSearch1 = () => {
    console.log("찾기 버튼 1 클릭!");
  };
  const handleSearch2 = () => {
    console.log("찾기 버튼 2 클릭!");
  };
  const handleSearch3 = () => {
    console.log("찾기 버튼 3 클릭!");
  };
  const handleSearch4 = () => {
    console.log("찾기 버튼 4 클릭!");
  };

  // 일단 더미 데이터로 모두 ["test"] 넣거나, 개별로 다르게 넣을 수도 있음
  const listData1 = ["test1", "test2"];
  const listData2 = ["testA"];
  const listData3 = ["testX", "testY", "testZ"];
  const listData4 = ["test"];

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

  // 닉네임 중복확인
  const handleNicknameCheck = () => {
    console.log("닉네임 중복확인 ->", nickname);
  };

  // 피부타입 토글
  const toggleSkinType = (type) => {
    if (skinTypes.includes(type)) {
      setSkinTypes(skinTypes.filter((t) => t !== type));
    } else {
      setSkinTypes([...skinTypes, type]);
    }
  };

  // 다음 버튼(1단계) / 완료 버튼(2단계)
  const handleNextOrSubmit = () => {
    if (step === 1) {
      // 1단계 데이터 확인 후 2단계로 넘어가기
      const data = { gender, birthYear, nickname, skinTypes };
      console.log("1단계 회원정보 입력 값:", data);
      setStep(2);
    } else {
      // 2단계 완료 로직
      console.log("2단계 정보도 모두 입력 - 최종 완료");
      // TODO: 서버 전송 or 페이지 이동
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
              setNickname={setNickname}
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
            listData={listData1}
          />
          <UserInfo2
            label="나에게 잘 맞는 성분 등록(선택)"
            placeholder="나에게 잘 맞는 성분을 등록해주세요"
            onSearchClick={handleSearch2}
            listData={listData2}
          />
          <UserInfo2
            label="나에게 맞지 않는 화장품 등록(필수)"
            placeholder="나에게 맞지 않는 화장품을 등록해주세요"
            onSearchClick={handleSearch3}
            listData={listData3}
          />
          <UserInfo2
            label="나에게 맞지 않는 성분 등록(선택)"
            placeholder="나에게 맞지 않는 성분을 등록해주세요"
            onSearchClick={handleSearch4}
            listData={listData4}
          />

          {/* "완료" 버튼 */}
          <Button text="완료" color="white" onClick={handleNextOrSubmit} />
        </>
      )}
    </div>
  );
}

export default UserForm;
