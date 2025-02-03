import { useState } from "react";
import { Link } from "react-router-dom"; // 추가
import "./Login.scss";
import Logo from "../../components/common/Logo.jsx";
import AuthBox from "../../components/auth/AuthBox.jsx";
import Button from "../../components/common/Button.jsx";
import kakaoLoginBtn from "../../assets/images/kakao_login_medium_wide.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // 로그인 처리
    console.log("로그인:", { email, password });
  };

  // const handleSignUpClick = () => {
  //   setShowSignUp(true);
  // };

  return (
    <div className="login-container">
      {/* 상단 로고 */}
      <Logo />

      {/* SIGN UP 버튼 */}
      {/* <button className="signup-circle" onClick={handleSignUpClick}>
            SIGN UP
          </button> */}

      {/* 로그인 폼 */}
      <form onSubmit={handleLoginSubmit}>
        <AuthBox 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
        <Button text="로그인" color="white" type="submit" />
      </form>

      <p className="password-find">
        <Link to="/findpw">비밀번호 찾기</Link> | <Link to="/signup">회원가입</Link>
      </p>
      <hr className="divider" />

      <img
        className="kakao-login-btn"
        src={kakaoLoginBtn}
        alt="kakao-login-btn"
      />
    </div>
  );
}

export default Login;
