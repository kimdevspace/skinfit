/*CosmeticsRoute.jsx*/
import { Routes, Route } from "react-router-dom";
import CosmeticDetail from "../pages/cosmetics/CosmeticDetail";
import ReviewRegister from "../pages/review/ReviewRegister";

function CosmeticsRoute() {
  return (
    <Routes>
      <Route path=":cosmeticId" element={<CosmeticDetail />} />
      <Route path=":cosmeticId/review" element={<ReviewRegister />} />
    </Routes>
  );
}
export default CosmeticsRoute;