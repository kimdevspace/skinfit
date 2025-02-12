/*MyPageRoute.jsx*/
import { Routes, Route } from "react-router-dom";
import MyPage from '../pages/mypage/MyPage.jsx';
import IngredientDetail from "../pages/mypage/IngredientDetail.jsx";
import EditUserInfo from "../pages/mypage/EditUserInfo.jsx";

function MyPageRoute() {
  return (
    <Routes>
        <Route path="/" element={<MyPage />} />
      {/* <Route path=":id" element={<MyPage />} /> */}

      {/* {/* <Route path=":id/edit" element={<EditUserInfo />} /> */}
       <Route path="/edit" element={<EditUserInfo />} />

      <Route path="/ingredient" element={<IngredientDetail />} />
      {/* <Route path=":id/ingredient" element={<IngredientDetail />} />  */}
    </Routes>
  );
}

export default MyPageRoute;