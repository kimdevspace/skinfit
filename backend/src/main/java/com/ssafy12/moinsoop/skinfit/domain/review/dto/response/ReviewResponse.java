package com.ssafy12.moinsoop.skinfit.domain.review.dto.response;

import com.ssafy12.moinsoop.skinfit.domain.review.entity.Review;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ReviewResponse {
    private int totalCount;
    private List<ReviewDto> reviews;
}
