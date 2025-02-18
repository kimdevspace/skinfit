// src/pages/admin/ReviewManagement.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosInstance.js";
import "./ReviewManagement.scss";

// 테스트용 하드코딩된 토큰 (실제 배포 시엔 적절한 저장소에서 불러오세요)
const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVUeXBlIjoiQURNSU4iLCJpYXQiOjE3Mzk3Njc1NDcsImV4cCI6MTczOTc2OTM0N30.jgn_yQlQrwRWN2RWW24SsUtgzBj2IAT44TlP1Nm8qKo";

// 신고 5회 이상인 리뷰 목록을 가져오는 API 함수
const fetchReportedReviews = async () => {
  const response = await axios.get("admin/reports", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response);
  
  if (response.data.status !== "success") {
    throw new Error("리뷰를 가져오는데 실패했습니다.");
  }
  return response.data.data; // 리뷰 리스트
};

// 선택한 리뷰들을 삭제하는 API 함수
const deleteReviews = async (reviewIds) => {
  const response = await axios.delete("admin/reports", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { reviewIds },
  });
  if (response.data.status !== "success") {
    throw new Error("리뷰 삭제에 실패했습니다.");
  }
  return response.data;
};

function ReviewManagement() {
  const queryClient = useQueryClient();
  const [selectedReviewIds, setSelectedReviewIds] = useState([]);

  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reportedReviews"],
    queryFn: fetchReportedReviews,
  });

  // useMutation (v5 객체 형태)
  const deleteMutation = useMutation({
    mutationFn: deleteReviews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportedReviews"] });
      setSelectedReviewIds([]);
      alert("선택된 리뷰가 삭제되었습니다.");
    },
    onError: () => {
      alert("오류가 발생했습니다.");
    },
  });

  const handleSelectReview = (reviewId) => {
    if (selectedReviewIds.includes(reviewId)) {
      setSelectedReviewIds(selectedReviewIds.filter((id) => id !== reviewId));
    } else {
      setSelectedReviewIds([...selectedReviewIds, reviewId]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked && reviews.length > 0) {
      const allIds = reviews.map((r) => r.reviewId);
      setSelectedReviewIds(allIds);
    } else {
      setSelectedReviewIds([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedReviewIds.length === 0) {
      alert("삭제할 리뷰를 선택하세요.");
      return;
    }
    deleteMutation.mutate(selectedReviewIds);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return (
      <div>
        리뷰를 불러오는 중 오류가 발생했습니다.
        <br />
        {error?.message}
      </div>
    );
  }

  return (
    <div className="review-management">
      <h2>리뷰 관리 (5회 이상 신고)</h2>
      <table className="review-management__table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={reviews.length > 0 && selectedReviewIds.length === reviews.length}
              />
            </th>
            <th>ID</th>
            <th>내용</th>
            <th>신고 횟수</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.reviewId}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedReviewIds.includes(review.reviewId)}
                  onChange={() => handleSelectReview(review.reviewId)}
                />
              </td>
              <td>{review.reviewId}</td>
              <td>{review.content}</td>
              <td>{review.reportCount}</td>
              <td>{review.writerNickname}</td>
              <td>{new Date(review.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td colSpan="6" className="review-management__empty">
                신고 5회 이상인 리뷰가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="review-management__actions">
        <button onClick={handleDeleteSelected} disabled={deleteMutation.isLoading}>
          {deleteMutation.isLoading ? "삭제 중..." : "선택된 리뷰 삭제"}
        </button>
      </div>
    </div>
  );
}

export default ReviewManagement;
