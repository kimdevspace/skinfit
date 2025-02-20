package com.ssafy12.moinsoop.skinfit.domain.admin.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReportDetailResponse {
    private Integer reportId;     // 신고 ID
    private Integer reviewId;     // 리뷰 ID
    private Integer reporterId;   // 신고자 ID
    private String reason;        // 신고 사유
}
