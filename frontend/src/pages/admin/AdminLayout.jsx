// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div style={{ display: "flex", width:"800px" }}>
      <AdminSidebar />
      <div style={{ flex: 1}}>
        {/* 하위 라우트(예: AdminHome, ReviewManagement, CosmeticCheck)가 여기에 렌더링 */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
