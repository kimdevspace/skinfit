// src/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminHome from "../pages/admin/AdminHome";
import ReviewManagement from "../pages/admin/ReviewManagement";
import CosmeticCheck from "../pages/admin/CosmeticCheck";
import CosmeticForm from "../pages/admin/CosmeticForm";
// CosmeticForm도 필요하다면 import 추가

function AdminRoutes() {
  return (
    <Routes>
      {/* AdminLayout이 사이드바와 메인 영역을 감싸므로, 여기서 하위 페이지를 렌더링 */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="reviews" element={<ReviewManagement />} />
        <Route path="cosmetics" element={<CosmeticCheck />} />
        <Route path="cosmetic-form/:cosmeticId" element={<CosmeticForm />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
