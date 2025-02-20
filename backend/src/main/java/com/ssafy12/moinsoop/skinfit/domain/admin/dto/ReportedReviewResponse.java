package com.ssafy12.moinsoop.skinfit.domain.admin.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReportedReviewResponse {
    private Integer reviewId;         // 리뷰 ID
    private String content;           // 리뷰 내용
    private int reportCount;          // 신고 횟수
    private String writerNickname;    // 리뷰 작성자의 닉네임
    private LocalDateTime createdAt;  // 리뷰 작성일시
    private List<ReportDetailResponse> reports; // 신고 내역 리스트
}
