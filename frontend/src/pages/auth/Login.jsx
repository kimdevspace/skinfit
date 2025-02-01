import { useState } from "react";
import "./Login.scss";
import invisibleEye from "../../assets/icons/login/invisibleEye.png";
import visibleEye from "../../assets/icons/login/visibleEye.png";
import Logo from "../../components/common/Logo.jsx";
import Button from "../../components/common/Button.jsx";
import kakaoLoginBtn from "../../assets/images/kakao_login_medium_wide.png";

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
      <Logo />

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

            <Button text="로그인" color="white" type="submit" />
          </form>

          <p className="password-find">비밀번호 찾기</p>
          <hr className="divider" />

          <img
            className="kakao-login-btn"
            src={kakaoLoginBtn}
            alt="kakao-login-btn"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
