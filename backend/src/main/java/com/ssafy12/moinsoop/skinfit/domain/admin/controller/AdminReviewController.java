package com.ssafy12.moinsoop.skinfit.domain.admin.controller;

import com.ssafy12.moinsoop.skinfit.domain.admin.dto.ReportedReviewResponse;
import com.ssafy12.moinsoop.skinfit.domain.admin.service.AdminReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminReviewController {

    private final AdminReviewService adminReviewService;

    /**
     * 신고 5회 이상인 리뷰 목록 조회 API
     * URL: /api/v1/admin/reports
     */
    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReportedReviews() {
        List<ReportedReviewResponse> reviews = adminReviewService.getReportedReviews();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", reviews);
        return ResponseEntity.ok(response);
    }

}
