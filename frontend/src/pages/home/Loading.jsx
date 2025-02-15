import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Loading.scss";

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    // 2초 후에 intro 페이지로 이동
    const timer = setTimeout(() => {
      navigate("/intro");
    }, 2000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="intro-wrapper">
      <div className="intro-box ">
        <div className="title">
          <h1 className="intro-logo focus-in-expand">skinfit</h1>
          <p className="intro-slogan focus-in-expand">
            내 피부에 딱 맞는 화장품 찾기
          </p>
          <div className="circle left-circle"></div>
          <div className="circle right-circle"></div>
        </div>
      </div>
    </div>
  );
}
