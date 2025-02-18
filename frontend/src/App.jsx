import { Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import MyPageRoute from "./routes/MyPageRoute";
import HomeRoute from "./routes/HomeRoute";
import CosmeticsRoute from "./routes/CosmeticsRoute";
import Search from "./pages/search/Search";
import OcrScanner from "./pages/ocr/OcrScanner";
import AdminRoutes from "./routes/AdminRoutes";
import CompletePopUp from "./components/common/CompletePopUp";

function App() {
  return (
    <>
      <Routes>
        {/* 홈 관련 라우트 */}
        <Route path="/*" element={<HomeRoute />} />

        {/* 인증 관련 라우트 */}
        <Route path="/auth/*" element={<AuthRoutes />} />

        {/* 마이페이지 라우트 */}
        <Route path="/mypage/*" element={<MyPageRoute />} />

        {/* 제품 관련 페이지 라우트 */}
        <Route path="/cosmetics/*" element={<CosmeticsRoute />} />

        {/* 검색 페이지 */}
        <Route path="/search" element={<Search />} />

        {/* OCR 스캐너 페이지 */}
        <Route path="/ocr" element={<OcrScanner />} />
        
        {/* 어드민 관련 라우트 */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>

      {/* 완료 팝업창 (전역적으로 사용하기 위해 라우트 밖에 배치) */}
      <CompletePopUp />
    </>
  );
}

export default App;
