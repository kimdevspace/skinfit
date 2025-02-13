package com.ssafy12.moinsoop.skinfit.domain.review.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReviewErrorCode {

    USER_NOT_FOUND("해당 사용자를 찾을 수 없습니다."),
    COSMETIC_NOT_FOUND("해당 화장품을 찾을 수 없습니다."),
    REVIEW_CREATION_FAILED("리뷰 작성에 실패하였습니다."),
    REVIEW_NOT_FOUND("해당 리뷰를 찾을 수 없습니다."),
    REVIEW_PERMISSION_DENIED("리뷰 작성자만 수정할 수 있습니다."),
    ALREADY_LIKED("이미 좋아요를 누르셨습니다.");

    private final String message;
}