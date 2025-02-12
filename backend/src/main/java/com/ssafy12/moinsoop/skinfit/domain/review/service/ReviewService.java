package com.ssafy12.moinsoop.skinfit.domain.review.service;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.review.dto.request.ReviewRequest;
import com.ssafy12.moinsoop.skinfit.domain.review.dto.request.ReviewUpdateRequest;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.ReviewImage;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.repository.ReviewImageRepository;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.repository.ReviewRepository;
import com.ssafy12.moinsoop.skinfit.domain.review.exception.ReviewErrorCode;
import com.ssafy12.moinsoop.skinfit.domain.review.exception.ReviewException;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.repository.UserRepository;
import com.ssafy12.moinsoop.skinfit.domain.cosmetic.repository.CosmeticRepository;
import com.ssafy12.moinsoop.skinfit.infrastructure.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final UserRepository userRepository;
    private final CosmeticRepository cosmeticRepository;
    private final S3Uploader s3Uploader;  // 파일 업로드 서비스 주입

    // 리뷰 등록
    @Transactional
    public void createReview(Integer userId, Integer cosmeticId, ReviewRequest request, List<MultipartFile> images) {
        // 사용자 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ReviewException(ReviewErrorCode.USER_NOT_FOUND));

        // 화장품 확인
        Cosmetic cosmetic = cosmeticRepository.findById(cosmeticId)
                .orElseThrow(() -> new ReviewException(ReviewErrorCode.COSMETIC_NOT_FOUND));

        // 리뷰 저장
        Review review = Review.builder()
                .user(user)
                .cosmetic(cosmetic)
                .score(request.getScore())
                .content(request.getReviewContent())
                .build();

        Review savedReview = reviewRepository.save(review);

        // 이미지 파일이 있으면 S3에 업로드 후 ReviewImage 테이블에 저장
        if (images != null && !images.isEmpty()) {
            int sequenceCounter = 1;
            for (MultipartFile file : images) {
                String imageUrl = s3Uploader.uploadFile(file, "reviews");
                ReviewImage reviewImage = ReviewImage.builder()
                        .review(savedReview)
                        .imageUrl(imageUrl)
                        .sequence(sequenceCounter++)  // 순서대로 번호 할당 (1부터 시작)
                        .build();
                reviewImageRepository.save(reviewImage);
            }
        }
    }

    //
    @Transactional
    public void updateReview(Integer userId, Integer cosmeticId, Integer reviewId, ReviewUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ReviewException(ReviewErrorCode.USER_NOT_FOUND));
        Cosmetic cosmetic = cosmeticRepository.findById(cosmeticId)
                .orElseThrow(() -> new ReviewException(ReviewErrorCode.COSMETIC_NOT_FOUND));
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewException(ReviewErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getUserId().equals(userId)) {
            throw new ReviewException(ReviewErrorCode.USER_NOT_FOUND); // 에러코드 이게 맞는지?
        }
        review.updateReview(request.getReviewContent(), request.getScore());
    }
}