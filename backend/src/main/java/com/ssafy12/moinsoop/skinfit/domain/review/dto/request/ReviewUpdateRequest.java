package com.ssafy12.moinsoop.skinfit.domain.review.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewUpdateRequest {

    @NotNull(message = "리뷰 내용을 작성해 주세요.")
    private String reviewContent;

    @NotNull(message = "평가 요소를 선택해 주세요.")
    private Integer score;
}
