package com.ssafy12.moinsoop.skinfit.domain.admin.service;

import com.ssafy12.moinsoop.skinfit.domain.admin.dto.ReportDetailResponse;
import com.ssafy12.moinsoop.skinfit.domain.admin.dto.ReportedReviewResponse;
import com.ssafy12.moinsoop.skinfit.domain.admin.exception.AdminReviewException;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.ReviewReport;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminReviewService {

    private final ReviewRepository reviewRepository;

    /**
     * 신고 횟수가 5회 이상인 리뷰 목록을 조회하고 DTO로 변환
     */
    public List<ReportedReviewResponse> getReportedReviews() {
        List<Review> reviews = reviewRepository.findByReportCountGreaterThanEqual(5);

        return reviews.stream().map(review -> {
            // 리뷰의 신고 내역을 DTO로 변환
            List<ReportDetailResponse> reportDetails = review.getReviewReports()
                    .stream()
                    .map(report -> new ReportDetailResponse(
                            report.getReportId(),
                            review.getReviewId(),         // 리뷰 ID
                            report.getUser().getUserId(), // 신고자 ID
                            report.getReason()            // 신고 사유
                    ))
                    .collect(Collectors.toList());

            String writerNickname = review.getUser().getNickname();

            return new ReportedReviewResponse(
                    review.getReviewId(),
                    review.getContent(),
                    review.getReportCount(),
                    writerNickname,
                    review.getCreatedAt(),
                    reportDetails
            );
        }).collect(Collectors.toList());
    }
}
