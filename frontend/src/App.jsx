import { Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import MyPageRoute from "./routes/MyPageRoute";
import HomeRoute from "./routes/HomeRoute";
import CosmeticsRoute from "./routes/CosmeticsRoute";
import Search from "./pages/search/Search";
import OcrScanner from "./pages/ocr/OcrScanner";

function App() {
  return (
    <Routes>
      {/* 홈 관련 라우트 */}
      <Route path="/*" element={<HomeRoute />} />
      
      {/* 기본 경로에서 '/auth/login'으로 리디렉트 */}
      {/* frontend 개발 진행할 때 바꿔가면서 진행하시고 최종에 삭제 예정 */}
      {/* <Route path="/" element={<Navigate to="/auth/login" replace />} /> */}

      {/* 인증 관련 라우트 */}
      <Route path="/auth/*" element={<AuthRoutes />} />
      
      {/* 마이페이지 라우트 */}
      <Route path="/mypage/*" element={<MyPageRoute />} />
      
      {/* 제품 관련 페이지 라우트(제품 상세 페이지) */}
      <Route path="/cosmetics/*" element={<CosmeticsRoute />} />
      
      {/* 검색 페이지 */}
      <Route path="/search" element={<Search />} />

      {/* OCR 스캐너 페이지 */}
      <Route path="/ocr" element={<OcrScanner />} />
      
    </Routes>
  );
}

export default App;
