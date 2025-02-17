import { useEffect } from "react";
import "./CompletePopUp.scss";
import { useCompletePopupStore } from "../../stores/CompletePopup";

const CompletePopUp = () => {
  const { isOpen, text, hidePopup } = useCompletePopupStore();
  console.log(isOpen, text);

  // 받침이 있는지 확인하는 함수
  const isEndWithConsonant = (str) => {
    if (typeof str !== "string") return false;

    const lastCharCode = str.charCodeAt(str.length - 1);
    // 한글 유니코드 범위 확인 (가 ~ 힣)
    if (lastCharCode < 0xac00 || lastCharCode > 0xd7a3) {
      return false;
    }
    // 받침 존재 여부 확인
    return (lastCharCode - 0xac00) % 28 > 0;
  };

  // 3초 후에 자동으로 팝업 닫기
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(hidePopup, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hidePopup]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="complete-popup">
        <div className="circle-check">
          <svg className="circle-animation" viewBox="0 0 52 52">
            <circle
              className="circle"
              cx="26"
              cy="26"
              r="20"
              fill="none"
              stroke="#FAB592"
              strokeWidth="3"
            />
            <path
              className="check"
              fill="none"
              stroke="#FAB592"
              strokeWidth="3"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h2 className="popup-msg">
          {text}
          {isEndWithConsonant(text) ? "이" : "가"} 완료되었습니다
        </h2>
      </div>
    </div>
  );
};

export default CompletePopUp;
