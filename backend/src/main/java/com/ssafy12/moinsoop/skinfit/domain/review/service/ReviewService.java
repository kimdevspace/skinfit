package com.ssafy12.moinsoop.skinfit.domain.review.service;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.review.dto.reponse.ReviewResponse;
import com.ssafy12.moinsoop.skinfit.domain.review.dto.request.ReviewRequest;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.ReviewImage;
import com.ssafy12.moinsoop.skinfit.domain.review.repository.ReviewImageRepository;
import com.ssafy12.moinsoop.skinfit.domain.review.repository.ReviewRepository;
import com.ssafy12.moinsoop.skinfit.domain.review.exception.ReviewErrorCode;
import com.ssafy12.moinsoop.skinfit.domain.review.exception.ReviewException;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.repository.UserRepository;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.repository.CosmeticRepository;
import com.ssafy12.moinsoop.skinfit.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final UserRepository userRepository;
    private final CosmeticRepository cosmeticRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public ReviewResponse createReview(Integer userId, Integer cosmeticId, ReviewRequest request) {

        // 사용자 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ReviewException(ReviewErrorCode.USER_NOT_FOUND));

        // 화장품 확인
        Cosmetic cosmetic = cosmeticRepository.findById(cosmeticId)
                .orElseThrow(() -> new ReviewException(ReviewErrorCode.COSMETIC_NOT_FOUND));

        // 리뷰 저장
        Review review = new Review(user, cosmetic, request.getRating(), request.getReviewContent());
        Review savedReview = reviewRepository.save(review);

// 이미지 저장
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<ReviewImage> reviewImages = request.getImages().stream()
                    .map(imageUrl -> new ReviewImage(savedReview, imageUrl))
                    .collect(Collectors.toList());

            reviewImageRepository.saveAll(reviewImages); // 한 번의 DB 접근으로 저장
        }

        return ReviewResponse.builder()
                .status("success")
                .message("리뷰가 성공적으로 작성되었습니다.")
                .reviewId(savedReview.getReviewId())
                .images(request.getImages())
                .build();
    }
}