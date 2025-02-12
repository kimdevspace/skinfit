import React from "react";
import "./SearchPopup.scss";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import Button from "../common/Button";
// import img from "./image 89.png";

function SearchPopup({}) {
  return (
    <div className="search-popup-overlay">
      <div className="search-popup">
        <hr />
        <SearchBar />

        {/* 검색 결과 박스 */}
        <div className="search-result-box">
          {/* <SearchResult /> */}

          {/* 검색 결과 아이템 */}
          <div className="search-popup-item">
            {/* 화장품 검색 결과 */}
            {/* <img src={img} alt="" />
            <div className="text-box">
              <p className="brand-name">달바</p>
              <p className="main-text">미스트 화이트 머스크 트러플 세럼</p>
            </div> */}

            {/* 성분 검색 결과 */}
            <div className="text-box">
              <p className="main-text">히알루론산</p>
            </div>

            {/* 추가/삭제 버튼 */}
            <div className="btn-box">
              <button className="btn add-btn active">추가</button>
              <button className="btn remove-btn">삭제</button>
            </div>
          </div>
        </div>

        {/* 선택한 화장품/성분 확인 박스 */}
        <div className="my-list-box">
          <p className="title">맞지 않는 화장품</p>
          <div className="my-search-list">
            {/* <p className="info-msg">나와 맞지 않는 화장품을 추가해주세요</p> */}
          </div>
        </div>

        <Button text="등록하기" color="pink" />
      </div>
    </div>
  );
}

export default SearchPopup;
