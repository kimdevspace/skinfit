import React from 'react';

const CompletionPopup = () => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="circle-check">
          <svg className="circle-animation" viewBox="0 0 52 52">
            <circle className="circle" cx="26" cy="26" r="23" fill="none" stroke="#4CAF50" strokeWidth="3"/>
            <path 
              className="check"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="3"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">완료되었습니다!</h2>
      </div>

      <style>{

      }</style>
    </div>
  );
};

export default CompletionPopup;