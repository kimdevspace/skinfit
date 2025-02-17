package com.ssafy12.moinsoop.skinfit.domain.admin.service;

import com.ssafy12.moinsoop.skinfit.domain.admin.dto.DeleteReviewsRequest;
import com.ssafy12.moinsoop.skinfit.domain.admin.dto.DeleteReviewsResponse;
import com.ssafy12.moinsoop.skinfit.domain.admin.dto.ReportDetailResponse;
import com.ssafy12.moinsoop.skinfit.domain.admin.exception.AdminReviewException;
import com.ssafy12.moinsoop.skinfit.domain.admin.dto.ReportedReviewResponse;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    /**
     * 선택한 리뷰 삭제 처리
     */
    @Transactional
    public DeleteReviewsResponse deleteSelectedReviews(DeleteReviewsRequest request) {
        List<Integer> reviewIds = request.getReviewIds();

        if (reviewIds == null || reviewIds.isEmpty()) {
            throw new AdminReviewException("삭제할 리뷰를 선택해주세요.");
        }

        List<Integer> failedIds = new ArrayList<>();
        int deletedCount = 0;

        for (Integer reviewId : reviewIds) {
            try {
                Review review = reviewRepository.findById(reviewId)
                        .orElseThrow(() -> new AdminReviewException("리뷰 ID " + reviewId + "가 존재하지 않습니다."));
                reviewRepository.delete(review);
                deletedCount++;
            } catch (Exception e) {
                failedIds.add(reviewId); // 삭제 실패한 리뷰 ID
            }
        }

        return new DeleteReviewsResponse(deletedCount, failedIds);
    }
}
