import React, { useState } from "react";
import './SymptomPopup.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function SymptomPopup({ type, currentItem, setCurrentItem, onClose }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // 증상 변수
  const symptomList = [
    { name: "부음", value: 0 },
    { name: "열감", value: 1 },
    { name: "건조함", value: 2 },
    { name: "여드름", value: 3 },
    { name: "두드러기", value: 4 },
    { name: "가려움", value: 5 },
    { name: "따가움", value: 6 },
    { name: "기타", value: 7 },
    { name: "모름", value: 8 },
  ];

  // 증상 체크 감지 핸들러
  const handleCheckboxChange = (symptomValue) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptomValue)) {
        return prev.filter((value) => value != symptomValue);
      } else {
        return [...prev, symptomValue];
      }
    });
  };

  // 서브밋 핸들러
  const handleSubmit = () => {
    setCurrentItem()
    onClose();
  };

  return (
    <div className="symptom-popup-overlay">
      <div className="symptom-popup">

        {/* 닫기 버튼 */}
        <button className="close-btn" >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* 화장품/성분 사진, 이름 */}
        <div className="popup-item">
          {type === 'cosmetic' ? <img src="" alt="" /> : null}
          <p className="title">히알루론산</p>
        </div>

        {/* 증상 박스 */}
        <div className="symptom-box">
          <p className="info-text">사용 시 나타난 증상(중복선택 가능)</p>
          <div className="symptom-group">
            {symptomList.map((symptom) => (
              <label key={symptom.value}>
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom.value)}
                  onChange={() => handleCheckboxChange(symptom.value)}
                />
                <span className="symptom-name">{symptom.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 추가하기 버튼 */}
        <button className="add-btn" onClick={handleSubmit}>추가하기</button>
      </div>
    </div>
  );
}

export default SymptomPopup;
