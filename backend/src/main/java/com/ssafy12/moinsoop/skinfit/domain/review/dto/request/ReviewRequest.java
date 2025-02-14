package com.ssafy12.moinsoop.skinfit.domain.review.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewRequest {

    @NotNull(message = "리뷰 내용을 작성해 주세요.")
    private String reviewContent;

    @NotNull(message = "평가 요소를 선택해 주세요.")
    @Min(value = 0, message = "리뷰 평점은 0-2 사이의 값만 가능합니다.")
    @Max(value = 2, message = "리뷰 평점은 0-2 사이의 값만 가능합니다.")
    private Integer score;
}