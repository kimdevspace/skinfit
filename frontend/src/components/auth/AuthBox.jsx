import { useState } from "react";
import "./AuthBox.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

/**
 * @param {("login"|"findpw")} mode - "login"이면 로그인 폼, "findpw"이면 비밀번호 찾기 폼
 * @param {string} email - 입력받은 이메일
 * @param {Function} setEmail - 이메일 상태 세터
 * @param {string} password - 로그인/임시 비밀번호
 * @param {Function} setPassword - 비밀번호 상태 세터
 * @param {Function} handleSendEmailCode - 이메일 발송 버튼 클릭 시 실행할 함수
 */

const AuthBox = ({
  mode = "login",
  email,
  setEmail,
  password,
  setPassword,
  handleSendEmailCode,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth-mainbox">
      {/* mode에 따라 제목 변경 */}
      <h2>{mode === "login" ? "LOGIN" : "FIND PASSWORD"}</h2>

      {mode === "login" && (
        <>
          {" "}
          {/*편집 시 코드 가독성을 위해 접을 수 있도록 넣어뒀습니다 */}
          {/* 로그인용 이메일 입력 */}
          <div className="input-box">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="error-msg">가입 정보가 유효하지 않습니다</p>
          </div>
          {/* 로그인용 비밀번호 입력 */}
          <div className="input-box">
            <label htmlFor="password">비밀번호</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-eye" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} size="2xl" />
                ) : (
                  <FontAwesomeIcon icon={faEye} size="2xl" />
                )}
              </span>
            </div>
            <p className="error-msg">비밀번호가 유효하지 않습니다</p>
          </div>
        </>
      )}

      {mode === "findpw" && (
        <>
          {/* 비밀번호 찾기용 이메일 입력 */}
          <div className="input-box">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="error-msg">가입 정보가 유효하지 않습니다</p>
          </div>

          {/* 비밀번호 찾기용 임시 비밀번호 입력 */}
          <div className="input-box">
            <label htmlFor="tempPassword">임시 비밀번호</label>
            <div className="password-wrapper">
              <input
                id="tempPassword"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-eye-tempPassword" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} size="2xl" />
                ) : (
                  <FontAwesomeIcon icon={faEye} size="2xl" />
                )}
              </span>
              <button
                type="button"
                className="email-send-btn"
                onClick={handleSendEmailCode}
              >
                이메일 발송
              </button>
            </div>
            <p className="error-msg">비밀번호가 올바르지 않습니다</p>

            {/* 이메일 발송 버튼 */}
          </div>
        </>
      )}
    </div>
  );
};

export default AuthBox;
