// src/pages/admin/CosmeticCheck.jsx
import React from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axiosInstance.js";
import { useQuery } from "@tanstack/react-query";
import "./CosmeticCheck.scss";

const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVUeXBlIjoiQURNSU4iLCJpYXQiOjE3Mzk3Njc1NDcsImV4cCI6MTczOTc2OTM0N30.jgn_yQlQrwRWN2RWW24SsUtgzBj2IAT44TlP1Nm8qKo"
function CosmeticCheck() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["unverifiedCosmetics"],
    queryFn: () =>
      axios.get("admin/cosmetics/unverified",{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then((res) => res.data),
  });

  if (isLoading) return <div>Loading cosmetics...</div>;
  if (error) return <div>Error loading cosmetics.</div>;

  // data가 미검수 화장품 배열이라고 가정합니다.
  const cosmetics = data;

  return (
    <div className="cosmetic-check">
      <h2>화장품 등록 검수</h2>
      <table className="cosmetic-check__table">
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
          </tr>
        </thead>
        <tbody>
          {cosmetics && cosmetics.length > 0 ? (
            cosmetics.map((item, idx) => (
              <tr key={item.cosmeticId}>
                <td>{idx + 1}</td>
                <td>
                  <Link to={`/admin/cosmetic-form/${item.cosmeticId}`}>
                    {item.cosmeticName}
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="cosmetic-check__empty">
                등록 신청된 화장품이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CosmeticCheck;
