import { useState } from "react";
import "./AuthBox.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const AuthBox = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth-mainbox">
      <h2>LOGIN</h2>
      <div className="input-box">
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="error-msg">가입정보가 유효하지 않습니다</p>
      </div>
      <div className="input-box">
        <label htmlFor="">비밀번호</label>
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
    </div>
  );
};

export default AuthBox;
