package com.ssafy12.moinsoop.skinfit.domain.review.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReviewErrorResponse {
    private String errorCode;
    private String message;
}
