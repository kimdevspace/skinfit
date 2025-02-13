package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.ReviewImage;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class MyReviewResponse {
    private List<ReviewDto> myReviews;
    private List<ReviewDto> likedReviews;

    @Getter
    @Builder
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class ReviewDto {
        private Integer reviewId;
        private String content;
        private LocalDateTime createdAt;
        private int score;
        private CosmeticInfo cosmetic;
        private List<ImageDto> images;
        private int likeCount;

        public static ReviewDto from(Review review) {
            return ReviewDto.builder()
                    .reviewId(review.getReviewId())
                    .content(review.getContent())
                    .createdAt(review.getCreatedAt())
                    .score(review.getScore())
                    .cosmetic(new CosmeticInfo(review.getCosmetic()))
                    .images(review.getReviewImages().stream()
                            .map(ImageDto::new)
                            .sorted(Comparator.comparing(ImageDto::getSequence))
                            .toList())
                    .likeCount(review.getReviewLikes().size())
                    .build();
        }
    }

    @Getter
    @RequiredArgsConstructor(access = AccessLevel.PRIVATE)
    public static class CosmeticInfo {
        private Integer cosmeticId;
        private String name;
        private String brand;

        private CosmeticInfo(Cosmetic cosmetic) {
            this.cosmeticId = cosmetic.getCosmeticId();
            this.name = cosmetic.getCosmeticName();
            this.brand = cosmetic.getCosmeticBrand();
        }
    }

    @Getter
    @RequiredArgsConstructor(access = AccessLevel.PRIVATE)
    public static class ImageDto {
        private String imageUrl;
        private int sequence;

        private ImageDto(ReviewImage image) {
            this.imageUrl = image.getImageUrl();
            this.sequence = image.getSequence();
        }
    }
}
