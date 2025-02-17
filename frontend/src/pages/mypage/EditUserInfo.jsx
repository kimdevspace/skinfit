import "./EditUserInfo.scss";
import Category from "../../components/common/Category";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "../../components/common/Button.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import NavBar from "../../components/common/NavBar";

export default function EditUserInfo() {
  const navigate = useNavigate();

  // 닉네임 관리 변수
  const [nickname, setNickname] = useState(userData?.nickname || "");

  // 닉네임 중복확인
  const [nicknameChecked, setNicknameChecked] = useState(false);

  // 비밀번호 입력 감지지
  const [pwInput, setPwInput] = useState("");

  // 비밀번호 에러 설정
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  //비밀번호 보임 설정
  const [showPassword, setShowPassword] = useState(false);

  // 피부 타입 관리 변수
  const [skinTypes, setSkinTypes] = useState([]);

  //#region 기존 데이터 불러오기
  const fetchUserData = async () => {
    const response = await axios.get("user/mypage/info");
    return response.data;
  };

  const useUserData = () => {
    return useQuery({
      queryKey: ["userData"], // 쿼리 키
      queryFn: fetchUserData, // 데이터를 가져오는 함수
      onSuccess: (data) => {
        console.log("기존 유저 데이터 조회 완료", data);
      },
      onError: (error) => {
        console.error("기존 유저 데이터 조회 에러", error);
      },
    });
  };

  //기존 데이터 추출 //userData : 객체형태
  const { data: userData } = useUserData();

  //#endregion

  //#region 유저 정보 수정 요청
  const updateUserInfo = async (payload) => {
    const response = await axios.patch("user/mypage/info", payload);
    return response.data;
  };

  // useMutation 훅 사용
  const mutation = useMutation({
    mutationFn: updateUserInfo, // 업데이트 함수
    onSuccess: (data) => {
      console.log("사용자 정보 업데이트 성공", data);
      navigate("/mypage");
    },
    onError: (error) => {
      console.error("사용자 정보 업데이트 실패", error);
      // 에러 메시지 표시
    },
  });

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();

    // 닉네임이 변경되었는지 확인
    const isNicknameChanged = nickname !== userData?.nickname;

    if (isNicknameChanged && !nicknameChecked) {
      alert("닉네임 중복확인을 해주세요");
      return;
    }

    const payload = {
      nickname: nickname,
      skinTypes: skinTypes,
    };

    // 비밀번호가 입력되었고, 에러 메시지가 없는 경우에만 포함
    if (pwInput && !passwordErrorMsg) {
      payload.newPassword = pwInput;
    }

    // Mutation 실행
    mutation.mutate(payload);
  };

  //#endregion

  //#region 닉네임 변경

  //닉네임 중복확인 POST 요청
  const nicknameMutation = useMutation({
    mutationFn: async (payload) => {
      return axios.post("user/nickname-duplicate", payload);
    },
    onSuccess: (response) => {
      // response.data에 응답 메시지가 있다고 가정합니다.
      alert(response.data);
      setNicknameChecked(true);
    },
    onError: (error) => {
      console.log(" 닉네임 중복확인 오류", error);
      alert("닉네임 중복 확인 중 오류가 발생했습니다.");
      setNicknameChecked(false);
    },
  });

  // 닉네임 중복확인 post 요청 실행 함수
  const handleNicknameCheck = () => {
    nicknameMutation.mutate({ nickname });
  };

  //#endregion

  //#region 비밀번호 변경

  // 비밀번호 유효성 검사
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPwInput(value);
    console.log("새 비밀번호", value);

    // 간단한 예: 10자 이상 + 특수문자 포함 여부
    if (pwInput.length > 0) {
      if (pwInput.length < 10) {
        setPasswordErrorMsg("총 10글자 이상이 되어야해요");
        console.log("10글자 안됨 메시지", passwordErrorMsg);
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        setPasswordErrorMsg("특수문자가 포함되어 있지 않아요");
        console.log("특수문자 포함 안됨 메시지", passwordErrorMsg);
      } else {
        setPasswordErrorMsg("");
      }
    } else {
      setPasswordErrorMsg("");
    }
  };

  // 비번 보임 설정정
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  //#endregion

  //#region 피부타입

  // 피부타입 토글
  const toggleSkinType = (typeId) => {
    if (skinTypes.includes(typeId)) {
      setSkinTypes(skinTypes.filter((id) => id !== typeId));
    } else {
      setSkinTypes([...skinTypes, typeId]);
    }
  };

  //#endregion

  return (
    <>
      <div className="user-info-edit">
        {/* 닉네임 + 중복확인 */}
        <div className="form-group nickname-group">
          <label>닉네임 변경</label>
          <div className="nickname-row">
            <input
              id="nn"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              type="button"
              className="dup-check-btn"
              onClick={handleNicknameCheck}
            >
              중복확인
            </button>
          </div>
        </div>

        {/* 비번 입력력 폼 */}
        <div className="password-top-box">
          <form>
            <label htmlFor="pw" className="popup-title">
              비밀번호 변경
            </label>
            <div className="password-wrapper">
              <input
                name="pw"
                id="pw"
                type={showPassword ? "password" : "text"}
                placeholder="새 비밀번호를 입력해주세요"
                onChange={handlePasswordChange}
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
          </form>
        </div>

        {/* 피부타입 */}
        <Category skinTypes={skinTypes} onToggleType={toggleSkinType} />

        {/* "완료" 버튼 */}
        <Button
          text="완료"
          color="white"
          onSubmit={handleUserInfoSubmit}
          type="submit"
        />
      </div>
      <NavBar />
    </>
  );
}
