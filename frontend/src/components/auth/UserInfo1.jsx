import React from "react";
import "./UserInfo1.scss";

/**
 * @param {string} gender - "남" 또는 "여"
 * @param {Function} setGender
 * @param {string} birthYear
 * @param {Function} setBirthYear
 * @param {string} nickname
 * @param {Function} setNickname
 * @param {Function} onNicknameCheck - "중복확인" 버튼 클릭 시
 */

function UserInfo1({
  gender,
  setGender,
  birthYear,
  setBirthYear,
  nickname,
  setNickname,
  onNicknameCheck,
}) {
  // 출생연도 목록 예시(1950~2023)
  const years = [];
  for (let y = 2023; y >= 1950; y--) {
    years.push(y);
  }

  const handleSelectGender = (selected) => {
    setGender(selected);
  };

  return (
    <div className="user-info-1">
      {/* 성별 */}
      <div className="form-group gender-group">
        <label>성별</label>
        <div className="gender-options">
          <button
            type="button"
            className={`gender-btn ${gender === "남" ? "selected" : ""}`}
            onClick={() => handleSelectGender("남")}
          >
            남
          </button>
          <button
            type="button"
            className={`gender-btn ${gender === "여" ? "selected" : ""}`}
            onClick={() => handleSelectGender("여")}
          >
            여
          </button>
        </div>
      </div>

      {/* 출생연도 */}
      <div className="form-group birthyear-group">
        <label>출생연도</label>
        <select
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
        >
          <option value="">출생연도를 선택해주세요</option>
          {years.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* 닉네임 + 중복확인 */}
      <div className="form-group nickname-group">
        <label>닉네임</label>
        <div className="nickname-row">
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button
            type="button"
            className="dup-check-btn"
            onClick={onNicknameCheck}
          >
            중복확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserInfo1;
