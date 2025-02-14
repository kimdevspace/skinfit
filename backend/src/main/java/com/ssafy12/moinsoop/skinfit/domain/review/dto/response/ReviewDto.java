package com.ssafy12.moinsoop.skinfit.domain.review.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReviewDto {
    private Integer reviewId;
    private String userNickname;
    private String userSkinType;
    private String userAgeGroup;
    private String reviewContent;
    private Integer score;
    private int likes;
    private List<String> images;
    private int isLiked;
    private LocalDateTime createdAt;

}
