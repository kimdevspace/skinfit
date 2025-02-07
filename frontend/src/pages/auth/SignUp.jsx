import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import Logo from "../../components/common/Logo.jsx";
import Button from "../../components/common/Button.jsx";
import axios from "axios";
import "./SignUp.scss";

function SignUp() {
  const navigate = useNavigate();

  // 각 필드에 대한 상태
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState(""); // 이메일 인증번호
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 비밀번호 토글
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifyEmailText, setverifyEmailText] = useState("이메일 발송");

  // 에러 메시지 상태
  const [codeErrorMsg, setCodeErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState("");

  // 중복 여부: null(아직 확인 안 함) / true(중복) / false(중복 아님)
  // 에러일 경우 중복 에러가 아닐 경우 성공공
  const [isDuplicate, setIsDuplicate] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // 비밀번호 유효성 검사
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // 간단한 예: 10자 이상 + 특수문자 포함 여부
    if (value.length > 0) {
      if (value.length < 10) {
        setPasswordErrorMsg("10글자 이하입니다.");
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        setPasswordErrorMsg("특수문자가 포함되어 있지 않습니다.");
      } else {
        setPasswordErrorMsg("");
      }
    } else {
      setPasswordErrorMsg("");
    }
  };

  // 비밀번호 확인 검사
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // 입력을 시작하면, password와 일치하지 않을 시 에러
    if (value.length > 0 && value !== password) {
      setConfirmPasswordErrorMsg("비밀번호가 동일하지 않습니다.");
    } else {
      setConfirmPasswordErrorMsg("");
    }
  };

  //#region 이메일 중복 체크
  /**
   * @param {string} useremail "이메일"
   * @param {boolean} response "결과로 받아올 값은 boolean 형태"
   */

  const checkEmailDuplicate = async (email) => {
    try {
      const response = await axios.post("/api/v1/user/email-duplicate", {
        params: { email },
      });
      return response.status;
    } catch (error) {
      console.error("Email duplicate check failed:", error);
      throw error;
    }
  };

  const handleDuplicateCheck = async () => {
    try {
      const result = await checkEmailDuplicate(email); 
      if (result === 200)
      {
        setIsDuplicate(false);
        alert("사용 가능한 이메일입니다.");
      }
      else if(result === 409)
      {
        setIsDuplicate(true);
        alert("이미 가입된 메일입니다");
      }
    } catch (error) {
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };
  //#endregion

  //#region 이메일 인증 코드 전송
  /**
   * @param {string} useremail "이메일"
   *
   */
  const sendEmailVerification = async (email) => {
    try {
      const response = await axios.post("/api/v1/user/email-verification", {
        email,
      });
      return response.status;
    } catch (error) {
      console.error("Email verification send failed:", error);
      throw error;
    }
  };

  const handleSendEmailCode = async () => {
    try {
      await sendEmailVerification(email);
      setverifyEmailText("메일 재전송");
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      alert("인증번호 발송에 실패했습니다.");
    }
  };
  //#endregion

  //#region 회원가입 전송
  /**
   * @param {string} useremail "이메일"
   * @param {string} userPassword "비밀번호"
   * @param {int} code "인증코드"
   */
  const submitSignup = async (email, password, verifyCode) => {
    try {
      const response = await axios.post("/api/v1/user/signup", {
        email,
        password,
        verifyCode,
      });
      return response.status;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    // 혹시 남은 에러가 있으면 가입 중단
    if (
      codeErrorMsg ||
      passwordErrorMsg ||
      confirmPasswordErrorMsg ||
      !email ||
      !verifyCode ||
      !password ||
      !confirmPassword
    ) {
      alert("입력값을 다시 확인해주세요.");
      return;
    }
    try {
      const result = await submitSignup(email, password, verifyCode);
      if (result === 200)
      {
        alert("회원가입이 완료되었습니다.");
        navigate("/auth/login");
      }
    } catch (error) {
      // 서버가 반환한 에러 메세지가 있는지 확인합니다.
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`회원가입에 실패했습니다: ${error.response.data.message}`);
      } else {
        alert("회원가입에 실패했습니다.");
      }
    }
  };
  //#endregion

  return (
    <div className="signup-container">
      <Logo />
      <form onSubmit={handleSignUpSubmit}>
        <div className="signup-mainbox">
          <h2>SIGN UP</h2>

          {/* 이메일 필드 */}
          <div className="input-box">
            <label htmlFor="email">이메일</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // 이메일이 바뀌면 중복체크 상태 초기화
                  setIsDuplicate(null);
                }}
                required
              />
              {/* 중복 확인 버튼 */}
              <button
                type="button"
                className="email-send-btn"
                onClick={handleDuplicateCheck}
              >
                중복확인
              </button>
              {isDuplicate === true && (
                <p className="error-msg isActive">
                  이미 존재하는 아이디입니다.
                </p>
              )}
            </div>
          </div>

          {/* 인증번호 필드 */}
          <div className="input-box">
            <label htmlFor="verifyCode">인증번호</label>
            <div className="input-wrapper">
              <input
                id="verifyCode"
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                required
              />
              {/* 이메일 발송 버튼 */}
              {isDuplicate === false && (
                <button
                  type="button"
                  className="email-send-btn"
                  onClick={handleSendEmailCode}
                >
                  {verifyEmailText}
                </button>
              )}
            </div>
            {/* 인증번호 에러 메시지 */}
            {codeErrorMsg && (
              <p className="error-msg isActive">{codeErrorMsg}</p>
            )}
          </div>

          {/* 비밀번호 필드 */}
          <div className="input-box">
            <label htmlFor="password">비밀번호</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
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
            {/* 비밀번호 에러 메시지 */}
            {passwordErrorMsg && (
              <p className="error-msg isActive">{passwordErrorMsg}</p>
            )}
          </div>

          {/* 비밀번호 확인 필드 */}
          <div className="input-box">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <span
                className="toggle-eye"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} size="2xl" />
                ) : (
                  <FontAwesomeIcon icon={faEye} size="2xl" />
                )}
              </span>
            </div>
            {/* 비밀번호 확인 에러 메시지 */}
            {confirmPasswordErrorMsg && (
              <p className="error-msg isActive">{confirmPasswordErrorMsg}</p>
            )}
          </div>
        </div>
        <Button text="회원가입" color="white" type="submit" />
      </form>
    </div>
  );
}

export default SignUp;
