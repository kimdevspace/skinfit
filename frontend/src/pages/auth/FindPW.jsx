import { useState } from "react";
import AuthBox from "../../components/auth/AuthBox.jsx";
import Button from "../../components/common/Button.jsx";
import Logo from "../../components/common/Logo.jsx";
import "./FindPW.scss";

function FindPW() {
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  // 이메일 발송 로직 (임시 비밀번호 발급 등)
  const handleSendEmailCode = () => {
    console.log("임시 비밀번호 이메일 발송 ->", email);
  };

  // 전체 폼 제출 시
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("비밀번호 찾기 제출:", { email, tempPassword });
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
