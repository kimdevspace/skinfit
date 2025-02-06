package com.ssafy12.moinsoop.skinfit.domain.review.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ReviewExceptionHandler {

    @ExceptionHandler(ReviewException.class)
    public ResponseEntity<ReviewErrorResponse> handleReviewException(ReviewException e) {
        ReviewErrorResponse errorResponse = new ReviewErrorResponse(e.getErrorCode().name(), e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}
