// src/routes/AdminRoutes.jsx
import { Route } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminHome from '../pages/admin/AdminHome';
import ReviewManagement from '../pages/admin/ReviewManagement';
import CosmeticCheck from '../pages/admin/CosmeticCheck';
import CosmeticForm from '../pages/admin/CosmeticForm';

// 컴포넌트 대신 함수로 정의하여 Route 요소들을 반환
function AdminRoutes() {
  return [
    <Route key="admin-main" path="/" element={<AdminLayout />}>
      <Route index element={<AdminHome />} />
      <Route path="reviews" element={<ReviewManagement />} />
      <Route path="cosmetics" element={<CosmeticCheck />} />
      <Route path="cosmetic-form/:cosmeticId" element={<CosmeticForm />} />
    </Route>
  ];
}

export default AdminRoutes;
