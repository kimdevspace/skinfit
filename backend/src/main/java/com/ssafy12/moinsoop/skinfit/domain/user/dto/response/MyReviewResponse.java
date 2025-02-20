package com.ssafy12.moinsoop.skinfit.domain.user.dto.response;

import com.ssafy12.moinsoop.skinfit.domain.cosmetic.entity.Cosmetic;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import com.ssafy12.moinsoop.skinfit.domain.review.entity.ReviewImage;
import com.ssafy12.moinsoop.skinfit.domain.user.entity.User;
import lombok.*;
import java.time.LocalDateTime;
import java.time.Year;
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
        private int likes;
        private UserInfo writer;

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
                    .likes(review.getReviewLikes().size())
                    .writer(new UserInfo(review.getUser()))
                    .build();
        }
    }

    @Getter
    @RequiredArgsConstructor(access = AccessLevel.PRIVATE)
    public static class UserInfo {
        private Integer userId;
        private String nickname;
        private String ageRange;

        private UserInfo(User user) {
            this.userId = user.getUserId();
            this.nickname = user.getNickname();
            this.ageRange = calculateAgeRange(user.getBirthYear());
        }

        private String calculateAgeRange(Year birthYear) {
            if (birthYear == null) return "알 수 없음";

            int age = Year.now().getValue() - birthYear.getValue();
            int ageGroup = (age / 10) * 10;
            return String.format("%d대", ageGroup);
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
