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
            // 각 리뷰에 연결된 신고 내역을 DTO로 변환
            List<ReportDetailResponse> reportDetails = review.getReviewReports()
                    .stream().map(report -> convertToReportDetailResponse(report))
                    .collect(Collectors.toList());

            // 작성자 닉네임은 Review의 User 엔티티에서 가져온다고 가정
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

    /**
     * ReviewReport 엔티티를 ReportDetailResponse DTO로 변환하는 메서드
     * 신고일시 필드 제거 후 변환 처리
     */
    private ReportDetailResponse convertToReportDetailResponse(ReviewReport report) {
        return new ReportDetailResponse(
                report.getReportId(),
                report.getUser().getUserId(),  // 신고한 회원의 ID
                report.getReason(),
                1                              // API 명세에 따른 신고 상태 (필요 시 report.getStatus() 사용)
        );
    }

    /**
     * 신고 횟수가 5회 이상인 리뷰를 삭제
     */
    @Transactional
    public void deleteReportedReview(Integer reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AdminReviewException("해당 리뷰가 존재하지 않습니다."));

        reviewRepository.delete(review);
    }
}
