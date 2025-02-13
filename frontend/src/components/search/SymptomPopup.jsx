import React, { useState } from "react";
import "./SymptomPopup.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSearchPopupStore } from "../../stores/SearchPopup";

// type : 'cosmetic' or 'ingredient'
// item : 선택된 화장품/성분 데이터
// onClose : 팝업 닫기 함수
// onSubmit : 증상 선택 완료 함수
function SymptomPopup({ type, item, onClose, onSubmit }) {
  // 스토어에서 증상 리스트 가져오기
  const symptoms = useSearchPopupStore((state) => state.symptoms);

  // 선택된 증상들 저장하는 상태
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // 증상 체크박스 변경 처리
  const handleCheckboxChange = (symptomValue) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptomValue)) {
        return prev.filter((value) => value != symptomValue);
      } else {
        return [...prev, symptomValue];
      }
    });
  };

  // 증상 선택 완료 처리
  const handleSubmit = () => {
    if (selectedSymptoms.length === 0) {
      alert("최소 1개 이상의 증상을 선택해주세요.");
      return;
    }
    onSubmit(selectedSymptoms);
  };

  return (
    <div className="symptom-popup-overlay">
      <div className="symptom-popup">
        {/* 닫기 버튼 */}
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* 화장품/성분 사진, 이름 */}
        {/* <div className="popup-item">
          {type === "cosmetic" ? (
            <img src={item.imageUrl} alt={item.cosmeticName} />
          ) : null}
          <p className="title">
            {type === "cosmetic" ? item.cosmeticName : item.ingredientName}
          </p>
        </div> */}

        {/* 증상 박스 */}
        <div className="symptom-box">
          <p className="info-text">사용 시 나타난 증상(중복선택 가능)</p>
          <div className="symptom-group">
            {symptoms.map((symptom) => (
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
        <button
          className="add-btn"
          onClick={handleSubmit}
          disabled={selectedSymptoms.length === 0}
        >
          추가하기
        </button>
      </div>
    </div>
  );
}

export default SymptomPopup;
