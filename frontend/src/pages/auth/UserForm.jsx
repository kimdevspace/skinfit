import React, { useState, useCallback, useEffect, useRef } from "react"
import Header from "../../components/common/Header.jsx"
import UserInfo1 from "../../components/auth/UserInfo1.jsx"
import Category from "../../components/common/Category.jsx"
import Button from "../../components/common/Button.jsx"
import UserInfo2 from "../../components/auth/UserInfo2.jsx"
import { useMutation } from "@tanstack/react-query"
import axios from "../../api/axiosInstance.js"
import { useNavigate } from "react-router-dom"
import { useSearchPopupStore } from "../../stores/SearchPopup.js"
import SearchPopup from "../../components/search/SearchPopup.jsx"
import useAuthStore from "../../stores/Auth.js"
import { useCompletePopupStore } from '../../stores/CompletePopup.js'

function UserForm() {
  const showPopup = useCompletePopupStore(state => state.showPopup);
  
  // 통합된 유저 폼 상태
  const [formData, setFormData] = useState({
    gender: "",
    birthYear: "",
    nickname: "",
    skinTypes: [],
    nicknameChecked: false
  })
  
  // 추출을 위한 구조 분해 할당
  const { gender, birthYear, nickname, skinTypes, nicknameChecked } = formData
  
  const [validationErrors, setValidationErrors] = useState({})
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 현재 유효성 검사 상태를 추적하는 ref
  const validationStateRef = useRef({
    isValid: false,
    errors: {}
  })
  
  // SearchPopup 상태
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false)
  const [searchPopupProps, setSearchPopupProps] = useState(null)

  const navigate = useNavigate()
  const { items, getApiPayload, resetItems } = useSearchPopupStore()
  const setAuth = useAuthStore(state => state.setAuth)
  const currentYear = new Date().getFullYear()
  
  // 중복 클릭을 방지하기 위한 타이머 참조
  const clickTimerRef = useRef(null)

  // 뮤테이션 정의
  const nicknameMutation = useMutation({
    mutationFn: (payload) => axios.post("user/nickname-duplicate", payload),
    onSuccess: (response) => {
      setFormData(prev => ({ ...prev, nicknameChecked: true }))
      setValidationErrors(prev => {
        const newErrors = {...prev, nickname: ""};
        validationStateRef.current.errors = newErrors;
        return newErrors;
      })
      alert(response.data || "사용 가능한 닉네임입니다.")
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "닉네임 중복 확인 중 오류가 발생했습니다."
      setValidationErrors(prev => {
        const newErrors = {...prev, nickname: errorMessage};
        validationStateRef.current.errors = newErrors;
        return newErrors;
      })
      alert(errorMessage)
    },
  })

  const userInitMutation = useMutation({
    mutationFn: (payload) => axios.post("user/init", payload),
    onSuccess: (response) => {
      // 현재 인증 상태를 유지하면서 isRegistered만 true로 설정
    const authState = useAuthStore.getState();
    setAuth(
      authState.accessToken, 
      authState.roleType,
      true  // isRegistered를 true로 설정
    );

      // 저장이 완료될 시간을 주기 위해 약간의 지연 추가
      setTimeout(() => {
        resetItems()
        showPopup('회원 정보 등록');
        navigate("/")
      }, 100) // 100ms 지연
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "회원 정보 등록 중 오류가 발생했습니다."
      alert(errorMessage)
    },
    onSettled: () => setIsSubmitting(false)
  })

  // 입력 핸들러 - 모든 필드 변경을 처리하는 통합 함수
  const handleInputChange = useCallback((field, value) => {
    let error = ""
    
    // 필드별 유효성 검사
    if (field === 'gender' && !value) {
      error = "성별을 선택해주세요."
    } else if (field === 'birthYear') {
      const yearValue = parseInt(value, 10)
      if (!value) {
        error = "출생연도를 입력해주세요."
      } else if (isNaN(yearValue) || yearValue < 1900 || yearValue > currentYear) {
        error = `출생연도는 1900~${currentYear} 사이여야 합니다.`
      }
    } else if (field === 'nickname') {
      if (!value.trim()) {
        error = "닉네임을 입력해주세요."
      } else if (value.length < 2 || value.length > 10) {
        error = "닉네임은 2~10자 사이로 입력해주세요."
      }
      // 닉네임이 변경되면 중복확인 상태 초기화
      setFormData(prev => ({ ...prev, [field]: value, nicknameChecked: false }))
      setValidationErrors(prev => {
        const newErrors = { ...prev, [field]: error };
        validationStateRef.current.errors = newErrors;
        return newErrors;
      })
      return; // 닉네임은 위에서 이미 처리했으므로 여기서 종료
    }
    
    // 상태 업데이트
    setFormData(prev => ({ ...prev, [field]: value }))
    setValidationErrors(prev => {
      const newErrors = { ...prev, [field]: error };
      validationStateRef.current.errors = newErrors;
      return newErrors;
    })
  }, [currentYear])

  // 피부타입 토글 함수
  const toggleSkinType = useCallback((typeId) => {
    setFormData(prev => {
      const updatedTypes = prev.skinTypes.includes(typeId)
        ? prev.skinTypes.filter(id => id !== typeId)
        : [...prev.skinTypes, typeId]
      
      const error = updatedTypes.length === 0 ? "최소 1개 이상의 피부타입을 선택해주세요." : ""
      
      setValidationErrors(prev => {
        const newErrors = { ...prev, skinTypes: error };
        validationStateRef.current.errors = newErrors;
        return newErrors;
      })
      
      return { ...prev, skinTypes: updatedTypes }
    })
  }, [])

  // 닉네임 중복확인
  const handleNicknameCheck = useCallback(() => {
    if (!nickname.trim()) {
      setValidationErrors(prev => {
        const newErrors = {...prev, nickname: "닉네임을 입력해주세요."};
        validationStateRef.current.errors = newErrors;
        return newErrors;
      })
      alert("닉네임을 입력해주세요.")
      return
    }
    
    if (nickname.length < 2 || nickname.length > 10) {
      setValidationErrors(prev => {
        const newErrors = {...prev, nickname: "닉네임은 2~10자 사이로 입력해주세요."};
        validationStateRef.current.errors = newErrors;
        return newErrors;
      })
      alert("닉네임은 2~10자 사이로 입력해주세요.")
      return
    }
    
    nicknameMutation.mutate({ nickname })
  }, [nickname, nicknameMutation])

  // 검색 팝업 관련 함수
  const handleSearch = useCallback((category) => {
    setSearchPopupProps({
      type: category.includes("Cosmetics") ? "cosmetic" : "ingredient",
      suitability: category.includes("unsuitable") ? "unsuitable" : "suitable",
      category: category,
    })
    setIsSearchPopupOpen(true)
  }, [])

  // Step 1 유효성 검사 - 동기식으로 실행되고 결과를 즉시 반환
  const validateStep1 = useCallback(() => {
    const errors = {}
    
    if (!gender) errors.gender = "성별을 선택해주세요."
    
    if (!birthYear) {
      errors.birthYear = "출생연도를 입력해주세요."
    } else {
      const yearValue = parseInt(birthYear, 10)
      if (isNaN(yearValue) || yearValue < 1900 || yearValue > currentYear) {
        errors.birthYear = `출생연도는 1900~${currentYear} 사이여야 합니다.`
      }
    }
    
    if (!nickname.trim()) {
      errors.nickname = "닉네임을 입력해주세요."
    } else if (nickname.length < 2 || nickname.length > 10) {
      errors.nickname = "닉네임은 2~10자 사이로 입력해주세요."
    } else if (!nicknameChecked) {
      errors.nickname = "닉네임 중복확인을 해주세요."
    }
    
    if (skinTypes.length === 0) {
      errors.skinTypes = "최소 1개 이상의 피부타입을 선택해주세요."
    }
    
    // 유효성 검사 상태를 ref와 state 모두에 저장
    validationStateRef.current = {
      isValid: Object.keys(errors).length === 0,
      errors
    };
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [gender, birthYear, nickname, nicknameChecked, skinTypes, currentYear])

  // 다음/제출 버튼 핸들러 - 중복 클릭 방지 로직 추가
  const handleNextOrSubmit = useCallback(() => {
    // 이미 처리 중이거나 최근에 클릭했으면 무시
    if (isSubmitting || clickTimerRef.current) return
    
    // 중복 클릭 방지를 위한 타이머 설정 (300ms)
    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null
    }, 300)
    
    if (step === 1) {
      // 동기식으로 유효성 검사 실행
      const isValid = validateStep1()
      
      if (!isValid) {
        const errorMessages = Object.values(validationStateRef.current.errors)
          .filter(msg => msg).join('\n')
        
        if (errorMessages) {
          alert(`다음 항목을 확인해주세요:\n${errorMessages}`)
        }
        return
      }
      
      // 스텝 1에서 2로 넘어갈 때 저장된 정보 확인 로그
      console.log("=== 스텝 1 저장 정보 ===");
      console.log("성별:", gender);
      console.log("출생연도:", birthYear);
      console.log("닉네임:", nickname);
      console.log("닉네임 중복확인 완료:", nicknameChecked);
      console.log("선택된 피부타입:", skinTypes);
      
      // 다음 단계로 즉시 이동
      setStep(2)
    } else if (step === 2) {
      setIsSubmitting(true)
      console.log(getApiPayload())
      
      if (!items.suitableCosmetics.length || !items.unsuitableCosmetics.length) {
        setIsSubmitting(false)
        alert("잘 맞는 화장품과 맞지 않는 화장품은 필수로 등록해야 합니다.")
        return
      }

      const payload = {
        gender: gender === "남" ? "MALE" : "FEMALE",
        year: Number(birthYear),
        nickname: nickname,
        skinTypeIds: skinTypes,
        ...getApiPayload()
      }

      console.log(payload)
      
      // 즉시 API 호출
      userInitMutation.mutate(payload)
    }
  }, [
    step, validateStep1, isSubmitting,
    gender, birthYear, nickname, nicknameChecked, skinTypes, 
    items, getApiPayload, userInitMutation
  ])

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="user-form-container">
      <Header 
        title="회원정보 입력" 
        onBack={() => setStep(1)} 
        showBackButton={step === 2} 
      />

      {step === 1 && (
        <>
          <div className="form-section">
            <UserInfo1
              gender={gender}
              setGender={(value) => handleInputChange('gender', value)}
              birthYear={birthYear}
              setBirthYear={(value) => handleInputChange('birthYear', value)}
              nickname={nickname}
              setNickname={(value) => handleInputChange('nickname', value)}
              onNicknameCheck={handleNicknameCheck}
              errors={validationErrors}
            />

            <Category 
              skinTypes={skinTypes} 
              onToggleType={toggleSkinType} 
              error={validationErrors.skinTypes}
            />
          </div>

          <Button 
            text="다음" 
            color="white" 
            onClick={handleNextOrSubmit}
            disabled={isSubmitting} 
          />
        </>
      )}

      {step === 2 && (
        <>
          <UserInfo2 
            label="나에게 잘 맞는 화장품 등록(필수)" 
            placeholder="나에게 잘 맞는 화장품을 등록해주세요" 
            onSearchClick={() => handleSearch("suitableCosmetics")} 
            category="suitableCosmetics" 
            items={items.suitableCosmetics}
          />
          <UserInfo2 
            label="나에게 잘 맞는 성분 등록(선택)" 
            placeholder="나에게 잘 맞는 성분을 등록해주세요" 
            onSearchClick={() => handleSearch("suitableIngredients")} 
            category="suitableIngredients"
            items={items.suitableIngredients} 
          />
          <UserInfo2 
            label="나에게 맞지 않는 화장품 등록(필수)" 
            placeholder="나에게 맞지 않는 화장품을 등록해주세요" 
            onSearchClick={() => handleSearch("unsuitableCosmetics")} 
            category="unsuitableCosmetics"
            items={items.unsuitableCosmetics} 
          />
          <UserInfo2 
            label="나에게 맞지 않는 성분 등록(선택)" 
            placeholder="나에게 맞지 않는 성분을 등록해주세요" 
            onSearchClick={() => handleSearch("unsuitableIngredients")} 
            category="unsuitableIngredients"
            items={items.unsuitableIngredients} 
          />

          <Button 
            text={isSubmitting ? "제출 중..." : "완료"} 
            color="white" 
            onClick={handleNextOrSubmit}
            disabled={isSubmitting}
          />

          {isSearchPopupOpen && searchPopupProps && (
            <SearchPopup 
              {...searchPopupProps} 
              onClose={() => setIsSearchPopupOpen(false)} 
            />
          )}
        </>
      )}
    </div>
  )
}

export default UserForm