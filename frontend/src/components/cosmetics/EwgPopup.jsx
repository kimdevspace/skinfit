import "./EwgPopup.scss";
import ewgImg from "../../assets/images/ewg_popup.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function EwgPopup({onClose}) {

  return (
    <div className='popup-overlay'>
    <div className="ewg-popup-wrapper">
      <div className="title"> 안전등급이란?</div>
      
      <button className="close-btn" onClick={onClose}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <img src={ewgImg} alt="ewgPopup" />
      <div className="text">
        미국의 환경 비영리단체(EWG)에서 화장품 안정성 기준을 정하여
      </div>
      <div className="text">
        시판되는 제품들의 성분자료를 연구하는 기관의 데이터를 의미해요
      </div>
    </div>
    </div>
  );
}
