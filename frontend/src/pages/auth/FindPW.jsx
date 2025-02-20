import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "../../api/axiosInstance.js";
import AuthBox from "../../components/auth/AuthBox.jsx";
import Button from "../../components/common/Button.jsx";
import Logo from "../../components/common/Logo.jsx";
import "./FindPW.scss";
import useAuthStore from "../../stores/Auth.js";

function FindPW() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const setAuth = useAuthStore(state => state.setAuth); // 토큰 저장 필요 변수수

  const sendEmailCode = async (email) => {
    try
    {
      const response = await axios.post("user/password-temporary",
        {
          userEmail:email
        });
        return response.status;
    }
    catch (error)
    {
      console.error("이메일 인증에 실패 했습니다", error);
      throw error;
    }
  };

  // 이메일 발송 로직 (임시 비밀번호 발급 등)
  const handleSendEmailCode = async () => {
    try{
      const result = await sendEmailCode(email);
      if (result === 200)
      {
        alert("이메일 발송이 완료되었습니다");
      }
      else if (result === 400)
      {
        alert("가입되지 않은 이메일입니다.");
      }
    } 
    catch (error)
    {
      console.error("send mail failed:", error);
      throw error;
    }
  };


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

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      userEmail: email,
      userPassword: tempPassword,
    });
  };
  return (
    <div className="findpw-container">
      <Logo />
      <form onSubmit={handleSubmit}>
        <AuthBox
          mode="findpw"
          email={email}
          setEmail={setEmail}
          password={tempPassword}
          setPassword={setTempPassword}
          handleSendEmailCode={handleSendEmailCode}
        />
        <Button text="로그인" color="white" type="submit" />
      </form>
    </div>
  );
}

export default FindPW;
