import React, { useState } from "react";
import "./Login.css";
import invisibleEye from "../../assets/login/invisibleEye.png";
import visibleEye from "../../assets/login/visibleEye.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // 로그인 처리
    console.log("로그인:", { email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  return (
    <div className="login-container">
      {/* 상단 로고 */}
      <h1 className="skinfit-title">skinfit</h1>
      <p className="skinfit-subtitle">내 피부에 딱 맞는 화장품 찾기</p>

      {/* 가운데 정렬된 래퍼 */}
      <div className="box-wrapper">
        {/* 배경 박스 */}
        <div className="login-box-bg"></div>

        {/* 로그인 박스 */}
        <div className={`login-box-front ${showSignUp ? "move-box" : ""}`}>
          <h2 className="login-box-title">LOGIN</h2>

          {/* SIGN UP 버튼 */}
          <button className="signup-circle" onClick={handleSignUpClick}>
            SIGN UP
          </button>

          {/* 폼 */}
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

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
                  <img src={invisibleEye} alt="invisibleEye" />
                ) : (
                  <img src={visibleEye} alt="visibleEye" />
                )}
              </span>
            </div>

            <button type="submit" className="login-button">
              로그인
            </button>
          </form>

          <p className="password-find">비밀번호 찾기</p>
          <hr className="divider" />

          <button type="button" className="kakao-button">
            카카오 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
