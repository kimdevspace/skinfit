import { Routes, Route, Outlet } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import MyPageRoute from "./routes/MyPageRoute";
import Home from "./pages/home/Home";
import Intro from "./pages/home/Intro";
import Loading from "./pages/home/Loading";
import CosmeticsRoute from "./routes/CosmeticsRoute";
import Search from "./pages/search/Search";
import OcrScanner from "./pages/ocr/OcrScanner";
import AdminRoutes from "./routes/AdminRoutes";
import CompletePopUp from "./components/common/CompletePopUp";
import { ProtectedRoute, AdminRoute } from "./routes/ProtectedRoutes";
import KakaoCallbackPage from './pages/auth/KakaoCallbackPage'

function App() {
  return (
    <>
      <Routes>
        {/* 카카오 콜백을 위한 라우트 추가 */}
        <Route path="/api/v1/login/oauth2/code/kakao" element={<KakaoCallbackPage />} />
        {/* 홈 관련 라우트 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/intro" element={<Intro />} />
        <Route path="/loading" element={<Loading />} />

        {/* 인증 관련 라우트 */}
        <Route path="/auth/*" element={<AuthRoutes />} />

        {/* 보호된 라우트들 */}
        <Route
          path="/mypage/*"
          element={
            <ProtectedRoute>
              <MyPageRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cosmetics/*"
          element={
            <ProtectedRoute>
              <CosmeticsRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocr"
          element={
            <ProtectedRoute>
              <OcrScanner />
            </ProtectedRoute>
          }
        />

        {/* 어드민 관련 라우트 */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Outlet />
            </AdminRoute>
          }
        >
          {AdminRoutes()}
        </Route>
      </Routes>

      {/* 완료 팝업창 */}
      <CompletePopUp />
    </>
  );
}

export default App;
