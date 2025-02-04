import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
import "./Login.scss";
import Logo from "../../components/common/Logo.jsx";
import AuthBox from "../../components/auth/AuthBox.jsx";
import Button from "../../components/common/Button.jsx";
import kakaoLoginBtn from "../../assets/images/kakao_login_medium_wide.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/auth/signin", {
        userEmail: email,            
        userPassword: password,
      });

      const { accessToken, isRegistered } = response.data;
      console.log("로그인 성공:", response.data);

      // isRegistered 값이 "true" / "false" 로 온다고 가정
      if (isRegistered === "true") {
        // 이미 추가 등록된 사용자 -> 다른 사이트 or 페이지
        navigate("/"); 
      } else {
        // 추가 등록이 필요하다는 의미
        navigate("/auth/userform");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
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
        <Link to="/auth/findpw">비밀번호 찾기</Link> | <Link to="/auth/signup">회원가입</Link>
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
