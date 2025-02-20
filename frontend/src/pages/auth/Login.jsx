import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance.js";
import { useMutation } from "@tanstack/react-query";
import "./Login.scss";
import Logo from "../../components/common/Logo.jsx";
import AuthBox from "../../components/auth/AuthBox.jsx";
import Button from "../../components/common/Button.jsx";
import kakaoLoginBtn from "../../assets/images/kakao_login_medium_wide.png";
import useAuthStore from "../../stores/Auth.js";
import { useKakaoLogin } from "../../stores/KakaoLogin.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // useKakaoLogin 훅에서 initiateKakaoLogin 함수 가져오기
  const { initiateKakaoLogin } = useKakaoLogin();

  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: (credentials) => axios.post("auth/signin", credentials),
    onSuccess: (response) => {
      const { accessToken, roleType, registered } = response.data;
      console.log("registered 값:", registered, " | 타입:", typeof registered);
      console.log("로그인 성공:", response.data);

      // 액세스 토큰과 등록 상태를 함께 저장
      setAuth(accessToken, roleType, registered);

      // roleType에 따른 페이지 라우팅
      if (roleType === "ADMIN") {
        navigate("/admin");
      } else {
        // 사용자 상태에 따라 리다이렉트
        if (registered === true) {
          navigate("/"); // 이미 회원정보 등록된 사용자
        } else {
          navigate("/auth/userform"); // 회원정보 등록이 필요한 사용자
        }
      }
    },

    onError: (error) => {
      let errorMsg = "로그인 중 오류가 발생했습니다.";
      // 응답 데이터가 문자열이면 바로 사용, 객체라면 message 프로퍼티 사용
      if (error.response?.data) {
        errorMsg =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data.message || errorMsg;
      }
      alert(`로그인에 실패했습니다: ${errorMsg}`);
      console.error("로그인 실패:", error);
    },
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      userEmail: email,
      userPassword: password,
    });
  };

  return (
    <div className="login-container">
      {/* 상단 로고 */}
      <Logo />

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
        <Link to="/auth/findpw">비밀번호 찾기</Link> |{" "}
        <Link to="/auth/signup">회원가입</Link>
      </p>
      <hr className="divider" />

      <button onClick={initiateKakaoLogin}>
        <img
          className="kakao-login-btn"
          src={kakaoLoginBtn}
          alt="kakao-login-btn"
        />
      </button>
    </div>
  );
}

export default Login;
