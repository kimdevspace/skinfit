package com.ssafy12.moinsoop.skinfit.domain.review.controller;

import com.ssafy12.moinsoop.skinfit.domain.review.dto.reponse.ReviewResponse;
import com.ssafy12.moinsoop.skinfit.domain.review.dto.request.ReviewRequest;
import com.ssafy12.moinsoop.skinfit.domain.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cosmetics/{cosmeticId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 작성
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @AuthenticationPrincipal Integer userId,
            @PathVariable Integer cosmeticId,
            @Valid @RequestBody ReviewRequest request) {

        ReviewResponse response = reviewService.createReview(userId, cosmeticId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}