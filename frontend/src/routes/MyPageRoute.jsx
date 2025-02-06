/*MyPageRoute.jsx*/
import { Routes, Route } from "react-router-dom";
import MyPage from '../pages/mypage/MyPage.jsx';

function MyPageRoute() {
  return (
    <Routes>
        <Route path="/" element={<MyPage />} />
      {/* <Route path=":id" element={<MyPage />} /> */}
      {/* <Route path=":id/edit" element={<EditUserInfo />} />
      <Route path=":id/ingredient" element={<IngredientDetail />} /> */}
    </Routes>
  );
}

export default MyPageRoute;