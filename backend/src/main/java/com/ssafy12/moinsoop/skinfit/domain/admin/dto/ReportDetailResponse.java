package com.ssafy12.moinsoop.skinfit.domain.admin.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReportDetailResponse {
    private Integer reportId;
    private Integer reporterId;       // 신고한 회원의 ID
    private String reason;            // 신고 사유
    private int status;               // 신고 상태 (예: 0: 기본, 1: 신고)
}
