package com.ssafy12.moinsoop.skinfit.domain.review.dto.reponse;

import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class ReviewResponse {
    private String status;
    private String message;
    private Integer reviewId;
    private List<String> images;

    @Builder
    public ReviewResponse(String status, String message, Integer reviewId, List<String> images) {
        this.status = status;
        this.message = message;
        this.reviewId = reviewId;
        this.images = images;
    }

}
