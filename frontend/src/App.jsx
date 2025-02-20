import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
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
import { useEffect } from 'react';
import useAuthStore from './stores/Auth';

function App() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  // 페이지 로드마다 카카오 응답 확인
  useEffect(() => {
    const checkKakaoResponse = () => {
      // 카카오 로그인 진행 중인지 확인
      const isPendingLogin = sessionStorage.getItem('pendingKakaoLogin') === 'true';
      
      if (isPendingLogin) {
        try {
          // 화면 내용이 JSON인지 확인
          const bodyText = document.body.textContent || '';
          if (bodyText.trim().startsWith('{') && bodyText.trim().endsWith('}')) {
            // JSON 파싱 시도
            const jsonData = JSON.parse(bodyText);
            console.log('카카오 로그인 응답:', jsonData);
            
            if (jsonData.accessToken) {
              // 세션 스토리지에 저장
              sessionStorage.setItem('accessToken', jsonData.accessToken);
              sessionStorage.setItem('roleType', jsonData.roleType || 'USER'); 
              sessionStorage.setItem('registered', String(jsonData.isRegistered || false));
              
              // 인증 상태 설정
              setAuth(
                jsonData.accessToken,
                jsonData.roleType || 'USER',
                jsonData.isRegistered === true
              );
              
              // 진행 중 플래그 제거
              sessionStorage.removeItem('pendingKakaoLogin');
              
              // 회원가입 상태에 따라 리다이렉트
              if (jsonData.isRegistered === false) {
                navigate('/auth/userform', { replace: true });
              } else {
                navigate('/', { replace: true });
              }
              return;
            }
          }
        } catch (error) {
          console.error('응답 처리 중 오류:', error);
        }
      }
    };
    
    // 페이지 로드 직후 실행
    checkKakaoResponse();
  }, [navigate, setAuth]);

  return (
    <>
      <Routes>
        {/* 카카오 콜백을 위한 라우트 추가 */}
        <Route path="/login/oauth2/code/kakao" element={<KakaoCallbackPage />} />
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
