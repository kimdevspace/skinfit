import "./Header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

function Header({ title }) {
  return (
    <header>
      <button className="back-btn">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <h2>{title}</h2>
    </header>
  );
}

export default Header;
