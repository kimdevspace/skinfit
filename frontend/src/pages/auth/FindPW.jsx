import { useState } from "react";
import axios from "../../api/axiosInstance.js";
import AuthBox from "../../components/auth/AuthBox.jsx";
import Button from "../../components/common/Button.jsx";
import Logo from "../../components/common/Logo.jsx";
import "./FindPW.scss";

function FindPW() {
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const sendEmailCode = async (email) => {
    try
    {
      const response = await axios.get("user/password-temporary",
        {
          params: {email},
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


  // 전체 폼 제출 시
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("auth/signin", {
        userEmail: email,            
        userPassword: tempPassword,
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
      if (error.response.data.message) 
      {
        alert(`로그인에 실패했습니다: ${error.response.data.message}`)
      }
      console.error("로그인 실패:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
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
