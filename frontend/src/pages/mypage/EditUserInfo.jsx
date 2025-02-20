import "./EditUserInfo.scss";
import Category from "../../components/common/Category";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "../../components/common/Button.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import NavBar from "../../components/common/NavBar";
import useAuthStore from "../../stores/Auth.js";

export default function EditUserInfo() {
  const navigate = useNavigate();

  // 닉네임 관리 변수
  const [nickname, setNickname] = useState("");

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
    const verificationToken = useAuthStore.getState().verificationToken;
    
    // 검증 토큰이 없으면 에러 발생
    if (!verificationToken) {
      throw new Error('비밀번호 검증이 필요합니다');
    }
    
    // 검증 토큰을 헤더에 추가하여 요청
    const response = await axios.get("user/mypage/info", {
      headers: {
        'Verification-Token': verificationToken
      }
    });
    
    return response.data;
  };

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    onError: (error) => {
      // 검증 토큰 관련 에러 처리
      if (error.message === '비밀번호 검증이 필요합니다') {
        alert('내정보 수정을 위해 비밀번호 검증이 필요합니다.');
        navigate('/mypage/verify-password');
      } else {
        console.error('사용자 정보 가져오기 실패:', error);
        alert('사용자 정보를 가져오는데 실패했습니다.');
      }
    },
    // 검증 토큰이 있을 때만 쿼리 실행
    enabled: !!useAuthStore.getState().verificationToken,
  });

  // 사용자 데이터 로드 시 초기값 설정 (useEffect 사용)
  useEffect(() => {
    if (userData) {
      setNickname(userData.nickname || "");
      setSkinTypes(userData.skinTypes || []);
      // 기존 닉네임은 검증이 필요 없으므로 중복 확인 상태를 true로 설정
      setNicknameChecked(true);
    }
  }, [userData]);

  // 컴포넌트 마운트 시 검증 토큰 확인
  useEffect(() => {
    const verificationToken = useAuthStore.getState().verificationToken;
    if (!verificationToken) {
      alert('내정보 수정을 위해 비밀번호 검증이 필요합니다.');
      navigate('/mypage/verify-password');
    }
  }, [navigate]);

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

  // 닉네임 변경 핸들러
  const handleNicknameChange = (value) => {
    setNickname(value);
    // 기존 닉네임과 다른 경우에만 중복 확인 상태 초기화
    if (value !== userData?.nickname) {
      setNicknameChecked(false);
    } else {
      // 원래 닉네임으로 돌아온 경우 중복 확인 불필요
      setNicknameChecked(true);
    }
  };

  //#endregion

  //#region 비밀번호 변경

  // 비밀번호 유효성 검사
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPwInput(value);
    console.log("새 비밀번호", value);

    // 간단한 예: 10자 이상 + 특수문자 포함 여부
    if (value.length > 0) {
      if (value.length < 10) {
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

  //#region 유저 정보 수정 요청
  const updateUserInfo = async (payload) => {
    // Auth 스토어에서 검증 토큰 가져오기
    const verificationToken = useAuthStore.getState().verificationToken;
    
    if (!verificationToken) {
      throw new Error('비밀번호 검증이 필요합니다');
    }
    
    // 헤더에 검증 토큰 추가
    const response = await axios.patch("user/mypage/info", payload, {
      headers: {
        'Verification-Token': verificationToken
      }
    });
    
    // 응답 성공 후 검증 토큰 제거 (일회용)
    useAuthStore.getState().clearVerificationToken();
    
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
      // 검증 토큰 에러 특별 처리
    if (error.message === '비밀번호 검증이 필요합니다') {
      alert('내정보 수정을 위해 비밀번호 검증이 필요합니다.');
      navigate('/mypage/verify-password');
    } else {
      // 다른 에러 메시지 표시
      alert(`정보 수정 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
    }
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
      skinTypeIds: skinTypes,
    };

    // 비밀번호가 입력되었고, 에러 메시지가 없는 경우에만 포함
    if (pwInput && !passwordErrorMsg) {
      payload.newPassword = pwInput;
    }

    // Mutation 실행
    mutation.mutate(payload);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류가 발생했습니다: {error.message}</div>;

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
              onChange={(e) => handleNicknameChange(e.target.value)}
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
                type={showPassword ? "text" : "password"} // 수정된 부분
                value={pwInput} // 추가: 제어 컴포넌트로 변경
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
          onClick={handleUserInfoSubmit} // onSubmit 대신 onClick 사용
          type="button" // submit 대신 button 타입 사용
        />
      </div>
      <NavBar />
    </>
  );
}
