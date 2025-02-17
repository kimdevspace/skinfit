// src/components/admin/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.scss";

function AdminSidebar() {
  return (
    <aside className="AdminSidebar">
      <div className="AdminSidebar__logo">SKINFIT</div>
      <nav className="AdminSidebar__nav">
        <NavLink
          to="/admin/reviews"
          className={({ isActive }) =>
            isActive
              ? "AdminSidebar__item AdminSidebar__item--active"
              : "AdminSidebar__item"
          }
        >
          리뷰 관리
        </NavLink>
        <NavLink
          to="/admin/cosmetics"
          className={({ isActive }) =>
            isActive
              ? "AdminSidebar__item AdminSidebar__item--active"
              : "AdminSidebar__item"
          }
        >
          화장품 등록 검수
        </NavLink>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
