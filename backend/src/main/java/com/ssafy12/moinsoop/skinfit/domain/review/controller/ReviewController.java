package com.ssafy12.moinsoop.skinfit.domain.review.controller;

import com.ssafy12.moinsoop.skinfit.domain.review.dto.request.ReviewReportRequest;
import com.ssafy12.moinsoop.skinfit.domain.review.dto.request.ReviewRequest;
import com.ssafy12.moinsoop.skinfit.domain.review.dto.request.ReviewUpdateRequest;
import com.ssafy12.moinsoop.skinfit.domain.review.dto.response.ReviewResponse;
import com.ssafy12.moinsoop.skinfit.domain.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cosmetics/{cosmeticId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 작성
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createReview(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer cosmeticId,
            @RequestPart("review") @Valid ReviewRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        reviewService.createReview(userId, cosmeticId, request, images);
        return ResponseEntity.status(HttpStatus.CREATED).body("리뷰가 성공적으로 작성되었습니다.");
    }

    // 리뷰 수정 - 텍스트 수정
    @PutMapping(value = "/{reviewId}/content", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateReviewContent(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer cosmeticId,
            @PathVariable Integer reviewId,
            @Valid @RequestBody ReviewUpdateRequest request) {

        reviewService.updateReviewContent(userId, cosmeticId, reviewId, request);
        return ResponseEntity.ok("리뷰 내용이 성공적으로 수정되었습니다.");
    }

    // 리뷰 수정 - 이미지 수정: 파일 업데이트만 처리 (multipart/form-data)
    @PutMapping(value = "/{reviewId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateReviewImages(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer cosmeticId,
            @PathVariable Integer reviewId,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        reviewService.updateReviewImages(userId, cosmeticId, reviewId, images);
        return ResponseEntity.ok("리뷰 이미지가 성공적으로 수정되었습니다.");
    }

    // 리뷰 삭제
    @DeleteMapping(value = "/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer cosmeticId,
            @PathVariable Integer reviewId) {

        reviewService.deleteReview(userId, cosmeticId, reviewId);
        return ResponseEntity.ok("리뷰가 성공적으로 삭제되었습니다.");
    }

    // 리뷰 신고
    @PostMapping(value = "/{reviewId}/report")
    public ResponseEntity<String> reportReview(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer cosmeticId,
            @PathVariable Integer reviewId,
            @Valid @RequestBody ReviewReportRequest request) {

        reviewService.reportReview(userId, cosmeticId, reviewId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body("리뷰 신고가 성공적으로 접수되었습니다.");
    }

    // 리뷰 좋아요
    @PostMapping(value = "/{reviewId}/add-like")
    public ResponseEntity<String> addLikeReview(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer cosmeticId,
            @PathVariable Integer reviewId) {

        reviewService.addLikeReview(userId, cosmeticId, reviewId);
        return ResponseEntity.ok("좋아요가 성공적으로 반영되었습니다.");
    }

    // 리뷰 좋아요 삭제
    @DeleteMapping(value = "/{reviewId}/delete-like")
    public ResponseEntity<String> deleteLikeReview(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer cosmeticId,
            @PathVariable Integer reviewId) {

        reviewService.deleteLikeReview(userId, cosmeticId, reviewId);
        return ResponseEntity.ok("좋아요가 취소되었습니다.");
    }

    // 리뷰 조회
    @GetMapping
    public ResponseEntity<ReviewResponse> getReviews(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer cosmeticId,
            @RequestParam(value = "sort", defaultValue = "latest") String sort,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", defaultValue = "10") int limit,
            @RequestParam(value = "custom", defaultValue = "false") boolean custom) {

        ReviewResponse response = reviewService.getReviews(cosmeticId, sort, page, limit, custom, userId);
        return ResponseEntity.ok(response);
}
}