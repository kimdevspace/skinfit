//내 정보수정하기 페이지 & 회원탈퇴 접근을 위한 비밀번호 검증 컴포넌트
import "./PwCheckPopUp.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export default function PwCheckPopUp({ onClose, state }) {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  //비밀번호 맞지않아요 에러
  const pwErrorRef = useRef(null);

  // 회원탈퇴 Mutation
  const deleteAccountMutation = useMutation({
    mutationFn: (password) =>
      axios.delete("/api/v1/auth/withdraw", {
        data: { password },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      localStorage.removeItem("accessToken"); // 로컬 스토리지에서 JWT 제거
      navigate("/mainpage");
    },
    onError: (error) => {
      console.error("회원 탈퇴 중 오류 발생:", error);
      pwErrorRef.current.classList.add("error");
    },
  });

  // 회원탈퇴 실행 함수
  const onDeleteAccount = () => {
    deleteAccountMutation.mutate(pwInput); // 회원탈퇴 Mutation 호출
  };

  // 비밀번호 입력
  const [pwInput, setPwInput] = useState("");

  // 비밀번호 검증 요청
  const pwReview = async (userPassword) => {
    const formData = new FormData();
    formData.append("pw", userPassword);

    return axios.post(`/api/v1/user/password-verify`, formData);
  };

  //react query
  const mutation = useMutation({
    mutationFn: pwReview,
    onSuccess: () => {
      console.log("비밀번호 검증 완료");

      navigate("/info"); // 내 정보수정하기 페이지로 이동
    },
    onError: (error) => {
      console.error("비밀번호 검증 에러", error);
      pwErrorRef.current.classList.add("error");
    },
  });

  // 비밀번호 확인 제출
  const handlePwSubmit = (e) => {
    e.preventDefault();

    // pwErrorRef.current.classList.remove("error");

    if (!pwInput.trim()) {
      // 비밀번호 입력이 비어있을 경우
      pwErrorRef.current.classList.add("error");
    }

    if (state === "myinfo") {
      mutation.mutate({ userPassword: pwInput });
    } else {
      onDeleteAccount();
    }
  };

  //비밀번호 보임 설정
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="pw-overlay">
      <div className="pw-check-popup">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* 비번 입력력 폼 */}
        <form>
          <label htmlFor="pw" className="popup-title">
            비밀번호 확인
          </label>
          <div className="password-wrapper">
            <input
              name="pw"
              id="pw"
              type={showPassword ? "password" : "text"}
              placeholder="현재 비밀번호를 입력해주세요"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
            />
            <span className="toggle-eye" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} size="2xl" />
              ) : (
                <FontAwesomeIcon icon={faEye} size="2xl" />
              )}
            </span>
          </div>
          <p className="error-msg" ref={pwErrorRef}>
            비밀번호를 확인해주세요
          </p>

          <button className="submit-btn" onClick={handlePwSubmit}>
            {state === "withdraw" ? "회원탈퇴" : "확인"}
          </button>
        </form>
      </div>
    </div>
  );
}
